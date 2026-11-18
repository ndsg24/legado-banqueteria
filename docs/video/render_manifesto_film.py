"""Prepare the Runway dining-table shot as a properly framed web loop."""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--ffmpeg', required=True)
parser.add_argument('--input', type=Path, required=True)
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
stem = 'manifesto-table-v1'
# Start after the original reference framing and hide the loop seam with a 0.5s dissolve.
filters = '[0:v]trim=start=0.5:end=5,setpts=PTS-STARTPTS,fps=30,setsar=1,format=yuv420p,split=2[main][copy];[copy]trim=duration=0.5,setpts=PTS-STARTPTS[tail];[main][tail]xfade=transition=fade:duration=0.5:offset=4,trim=start=0.5,setpts=PTS-STARTPTS[out]'
master = args.output / f'{stem}.mp4'
subprocess.run([args.ffmpeg, '-y', '-i', str(args.input), '-filter_complex', filters, '-map', '[out]', '-an', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(master)], check=True)
subprocess.run([args.ffmpeg, '-y', '-i', str(master), '-an', '-vf', 'scale=720:-2', '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(args.output / f'{stem}-mobile.mp4')], check=True)
for suffix in ('', '-mobile'):
    subprocess.run([args.ffmpeg, '-y', '-i', str(args.output / f'{stem}{suffix}.mp4'), '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '30', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', '-pix_fmt', 'yuv420p', str(args.output / f'{stem}{suffix}.webm')], check=True)
subprocess.run([args.ffmpeg, '-y', '-i', str(master), '-frames:v', '1', '-quality', '90', str(args.output / f'{stem}-poster.webp')], check=True)
