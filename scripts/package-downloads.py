"""Refresh student/reference downloads after editing course source files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parents[1]
for filename,folder,prefix in [('student-starter.zip','student-files',''),('reference-solution.zip','demo','solution/')]:
 with ZipFile(root/'downloads'/filename,'w',ZIP_DEFLATED) as archive:
  source=root/folder
  for path in sorted(source.rglob('*')):
   if path.is_file():archive.write(path,prefix+str(path.relative_to(source)))
(root/'downloads/farms.geojson').write_bytes((root/'demo/data/farms.geojson').read_bytes())
print('Updated all course downloads.')
