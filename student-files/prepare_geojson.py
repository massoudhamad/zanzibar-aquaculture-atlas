"""Convert the supplied survey export to anonymous farm-location GeoJSON."""
import argparse, json, math
from collections import Counter
from pathlib import Path
import openpyxl
p=argparse.ArgumentParser()
p.add_argument('workbook',type=Path)
p.add_argument('--output',type=Path,default=Path('farms.geojson'))
a=p.parse_args()
w=openpyxl.load_workbook(a.workbook,read_only=True,data_only=True)
# This converter targets the supplied September 2026 export schema.
main=list(w.worksheets[0].values);headers=main.pop(0)
repeat=list(w['group_gy0jc35'].values);rh=repeat.pop(0)
def text(x):return str(x).strip() if x is not None else None
def num(x):
 try:
  n=float(x);return n if math.isfinite(n) else None
 except (TypeError,ValueError):return None
parents={r[headers.index('_index')]:r for r in main}
features=[]
for r in repeat:
 record=dict(zip(rh,r));parent=parents.get(record['_parent_index'])
 if parent is None:raise ValueError('Unmatched parent index')
 lon=num(record['_GPS location of farm_longitude'])
 lat=num(record['_GPS location of farm_latitude'])
 valid=lon is not None and lat is not None and -180<=lon<=180 and -90<=lat<=90
 def get(label):return text(parent[headers.index(label)])
 props=dict(id=f"ZF-{int(record['_index']):04}",
  surveyId=f"SV-{int(record['_parent_index']):03}",
  type=text(record['Type of Farm']) or 'Unspecified',
  district=get('District'),village=get('Shehia / Village'),
  ownership=get('Ownership type'),method=get('Farming method'),
  species=get('Species cultivated'),
  area=num(record['Area of the Farm / ponds/pens']),
  precision=num(record['_GPS location of farm_precision']))
 features.append(dict(type='Feature',geometry=dict(type='Point',coordinates=[lon,lat]) if valid else None,properties=props))
counts=Counter(tuple(f['geometry']['coordinates']) for f in features if f['geometry'])
for f in features:
 f['properties']['sharedLocation']=bool(f['geometry'] and counts[tuple(f['geometry']['coordinates'])]>1)
a.output.parent.mkdir(parents=True,exist_ok=True)
a.output.write_text(json.dumps(dict(type='FeatureCollection',features=features),ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Saved {len(features)} anonymous location records to {a.output}')
