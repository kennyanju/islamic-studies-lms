import os
import glob
import re
import zipfile
import shutil
import xml.etree.ElementTree as ET

def parse_voice_script(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        text = f.read()
    slides_raw = re.split(r'\n##\s*Slide\s+(\d+)[:\s]*', text)
    slide_dict = {}
    for i in range(1, len(slides_raw), 2):
        s_num = int(slides_raw[i])
        s_body = slides_raw[i+1].strip()
        lines = s_body.split('\n')
        title = lines[0].strip() if lines else f'Slide {s_num}'
        
        # summary
        sum_m = re.search(r'\*\s*\*\*Slide Summary:\*\*\s*(.*?)(?=\n\*|\Z)', s_body, re.DOTALL)
        summary = sum_m.group(1).strip() if sum_m else ''
        
        # delivery
        del_m = re.search(r'\*\s*\*\*Delivery Direction:\*\*\s*(.*?)(?=\n\*|\Z)', s_body, re.DOTALL)
        delivery = del_m.group(1).strip() if del_m else ''
        
        # narrative script
        scr_m = re.search(r'\*\s*\*\*Narrative Script[^\n]*\n(.*?)(?=\n\*|\Z)', s_body, re.DOTALL)
        script = scr_m.group(1).strip() if scr_m else ''
        if script.startswith('"') and script.endswith('"'):
            script = script[1:-1].strip()
            
        # concept analogy
        con_m = re.search(r'\*\s*\*\*Concept Analogy:\*\*\s*(.*?)(?=\n\*|\Z)', s_body, re.DOTALL)
        analogy = con_m.group(1).strip() if con_m else ''
        
        # check question
        q_m = re.search(r'\*\s*\*\*Check-for-Understanding Question:\*\*\s*(.*?)(?=\n\*|\Z)', s_body, re.DOTALL)
        question = q_m.group(1).strip() if q_m else ''
        
        slide_dict[s_num] = {
            'title': title,
            'summary': summary,
            'delivery': delivery,
            'script': script,
            'analogy': analogy,
            'question': question
        }
    return slide_dict

p_ns = 'http://schemas.openxmlformats.org/presentationml/2006/main'
a_ns = 'http://schemas.openxmlformats.org/drawingml/2006/main'
r_ns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

def build_p_element(text_str, is_bold=False):
    p = ET.Element(f'{{{a_ns}}}p')
    pPr = ET.SubElement(p, f'{{{a_ns}}}pPr', {'indent': '0', 'lvl': '0', 'marL': '0', 'rtl': '0', 'algn': 'l'})
    spcBef = ET.SubElement(pPr, f'{{{a_ns}}}spcBef')
    ET.SubElement(spcBef, f'{{{a_ns}}}spcPts', {'val': '0'})
    spcAft = ET.SubElement(pPr, f'{{{a_ns}}}spcAft')
    ET.SubElement(spcAft, f'{{{a_ns}}}spcPts', {'val': '0'})
    ET.SubElement(pPr, f'{{{a_ns}}}buNone')
    
    r = ET.SubElement(p, f'{{{a_ns}}}r')
    rPr_attrs = {'lang': 'en-US'}
    if is_bold:
        rPr_attrs['b'] = '1'
    ET.SubElement(r, f'{{{a_ns}}}rPr', rPr_attrs)
    t = ET.SubElement(r, f'{{{a_ns}}}t')
    t.text = text_str
    ET.SubElement(p, f'{{{a_ns}}}endParaRPr')
    return p

def process_pptx(pptx_path, md_path):
    print(f"\nProcessing {os.path.basename(pptx_path)}...")
    slide_dict = parse_voice_script(md_path)
    print(f"  Parsed {len(slide_dict)} slides from {os.path.basename(md_path)}")
    
    with zipfile.ZipFile(pptx_path, 'r') as zin:
        file_dict = {name: zin.read(name) for name in zin.namelist()}
        
    pres_root = ET.fromstring(file_dict['ppt/presentation.xml'])
    pres_rels_root = ET.fromstring(file_dict['ppt/_rels/presentation.xml.rels'])
    rid_to_target = {rel.get('Id'): rel.get('Target') for rel in pres_rels_root}
    
    sld_id_lst = pres_root.find(f'{{{p_ns}}}sldIdLst')
    slides = [rid_to_target[sld.get(f'{{{r_ns}}}id')] for sld in sld_id_lst]
    
    slide_to_notes = {}
    for s_idx, s in enumerate(slides, 1):
        rel_file = f'ppt/slides/_rels/{s.split("/")[-1]}.rels'
        if rel_file in file_dict:
            s_rels = ET.fromstring(file_dict[rel_file])
            for rel in s_rels:
                if 'notesSlide' in rel.get('Type', ''):
                    slide_to_notes[s_idx] = rel.get('Target').replace('../', 'ppt/')
                    break
                    
    print(f"  Mapped {len(slide_to_notes)} notes slides for {len(slides)} slides")
    
    for s_idx, notes_path in slide_to_notes.items():
        s_data = slide_dict.get(s_idx, {})
        notes_xml = file_dict[notes_path]
        root = ET.fromstring(notes_xml)
        
        # find body shape
        body_sp = None
        for sp in root.findall(f'.//{{{p_ns}}}sp'):
            ph = sp.find(f'.//{{{p_ns}}}ph')
            if ph is not None and ph.get('type') == 'body':
                body_sp = sp
                break
                
        if body_sp is not None:
            txBody = body_sp.find(f'{{{p_ns}}}txBody')
            for p in list(txBody.findall(f'{{{a_ns}}}p')):
                txBody.remove(p)
                
            txBody.append(build_p_element(f'=== SLIDE {s_idx}: {s_data.get("title", "")} ===', is_bold=True))
            txBody.append(build_p_element(''))
            
            txBody.append(build_p_element('🎙️ SPOKEN VOICE SCRIPT:', is_bold=True))
            script_text = s_data.get('script', '')
            for para in script_text.split('\n'):
                para = para.strip()
                if para:
                    txBody.append(build_p_element(para))
            txBody.append(build_p_element(''))
            
            if s_data.get('delivery'):
                txBody.append(build_p_element('🎬 DELIVERY DIRECTION:', is_bold=True))
                txBody.append(build_p_element(s_data['delivery']))
                txBody.append(build_p_element(''))
                
            if s_data.get('analogy'):
                txBody.append(build_p_element('💡 CONCEPT ANALOGY:', is_bold=True))
                txBody.append(build_p_element(s_data['analogy']))
                txBody.append(build_p_element(''))
                
            if s_data.get('question'):
                txBody.append(build_p_element('❓ CHECK QUESTION:', is_bold=True))
                txBody.append(build_p_element(s_data['question']))
                txBody.append(build_p_element(''))
                
            if s_data.get('summary'):
                txBody.append(build_p_element('📌 SUMMARY:', is_bold=True))
                txBody.append(build_p_element(s_data['summary']))
                
            file_dict[notes_path] = ET.tostring(root, encoding='utf-8', xml_declaration=True)
            
    # Write back to pptx
    temp_out = pptx_path + '.tmp'
    with zipfile.ZipFile(temp_out, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for name, data in file_dict.items():
            zout.writestr(name, data)
            
    os.replace(temp_out, pptx_path)
    print(f"  ✓ Successfully updated {os.path.basename(pptx_path)}")

def main():
    base_dir = 'Voice Script for teacher/Voice scripts'
    backup_dir = os.path.join(base_dir, 'backup_pptx_original')
    os.makedirs(backup_dir, exist_ok=True)
    
    # 9 modules mapping
    modules = [
        ('1 — Foundations of Belief.pptx', '1 — Foundations of Belief - Voice Script.md'),
        ('2— Purification & Prayer.pptx', '2— Purification & Prayer - Voice Script.md'),
        ('3 — Seerah The Early Life of the Prophet .pptx', '3 — Seerah The Early Life of the Prophet - Voice Script.md'),
        ('4— Deepening Belief & the Quran.pptx', '4— Deepening Belief & the Quran - Voice Script.md'),
        ('5— Fiqh of Fasting Zakah & Community.pptx', '5— Fiqh of Fasting Zakah & Community - Voice Script.md'),
        ('6— Seerah Madinah & the Building of a Community.pptx', '6— Seerah Madinah & the Building of a Community - Voice Script.md'),
        ('7— Applied Fiqh & Everyday Life.pptx', '7— Applied Fiqh & Everyday Life - Voice Script.md'),
        ('8— Character, Society & Family.pptx', '8— Character, Society & Family - Voice Script.md'),
        ('9— Seerah, History & Living Faith Today.pptx', '9— Seerah, History & Living Faith Today - Voice Script.md')
    ]
    
    for pptx_name, md_name in modules:
        pptx_path = os.path.join(base_dir, pptx_name)
        md_path = os.path.join(base_dir, md_name)
        
        if not os.path.exists(pptx_path):
            print(f"WARNING: PPTX not found: {pptx_path}")
            continue
        if not os.path.exists(md_path):
            print(f"WARNING: MD not found: {md_path}")
            continue
            
        backup_path = os.path.join(backup_dir, pptx_name)
        if not os.path.exists(backup_path):
            shutil.copy2(pptx_path, backup_path)
            print(f"Backed up {pptx_name}")
            
        process_pptx(pptx_path, md_path)
        
    print("\n✓ ALL 9 POWERPOINT DECKS HAVE BEEN INJECTED WITH FULL VOICE SCRIPTS IN SPEAKER NOTES!")

if __name__ == '__main__':
    main()
