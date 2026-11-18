"""Assemble the three Runway shots into a silent, web-optimized looping film.

Source files: encuentro-source.mp4, celebracion-source.mp4, sobremesa-source.mp4.
Pass a local FFmpeg executable; no video-generation API is called by this script.
"""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--ffmpeg', required=True)
parser.add_argument('--inputs', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
names = ('encuentro', 'celebracion', 'sobremesa')
inputs = [args.inputs / f'{name}-source.mp4' for name in names]
for source in inputs:
    if not source.is_file():
        parser.error(f'Missing source: {source}')

# Matched 5s shots, short dips through black, and the first 0.4s at the end.
# Trimming the same 0.4s off the beginning matches the final frame to the first.
filters = [f'[{i}:v]trim=duration=5,setpts=PTS-STARTPTS,fps=30,scale=960:960,setsar=1,format=yuv420p[v{i}]' for i in range(2)]
# The dessert generation makes an excessive late camera move. Use only its safe
# opening and interpolate the slowed motion instead of showing cropped glassware.
filters += ['[2:v]trim=duration=1.9,setpts=2.631579*(PTS-STARTPTS),minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,tpad=stop_mode=clone:stop_duration=0.4,trim=duration=5,scale=960:960,setsar=1,format=yuv420p[v2]']
filters += [
    '[v0]split=2[first][loop]',
    '[loop]trim=duration=0.4,setpts=PTS-STARTPTS[tail]',
    '[first][v1]xfade=transition=fadeblack:duration=0.4:offset=4.6[ab]',
    '[ab][v2]xfade=transition=fadeblack:duration=0.4:offset=9.2[abc]',
    '[abc][tail]xfade=transition=fadeblack:duration=0.4:offset=13.8,trim=start=0.4,setpts=PTS-STARTPTS[out]',
]
command = [args.ffmpeg, '-y']
for source in inputs:
    command += ['-i', str(source)]
command += ['-filter_complex', ';'.join(filters), '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(args.output / 'table-film-v1.mp4')]
subprocess.run(command, check=True)
subprocess.run([args.ffmpeg, '-y', '-i', str(args.output / 'table-film-v1.mp4'), '-an', '-vf', 'scale=640:640', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(args.output / 'table-film-v1-mobile.mp4')], check=True)
subprocess.run([args.ffmpeg, '-y', '-i', str(args.output / 'table-film-v1.mp4'), '-frames:v', '1', str(args.output / 'table-film-v1-poster.webp')], check=True)

for suffix in ('', '-mobile'):
    subprocess.run([args.ffmpeg, '-y', '-i', str(args.output / f'table-film-v1{suffix}.mp4'), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', '-pix_fmt', 'yuv420p', str(args.output / f'table-film-v1{suffix}.webm')], check=True)
