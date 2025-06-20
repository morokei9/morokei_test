import os
import random
from datetime import datetime
from pathlib import Path

from moviepy.editor import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
    CompositeVideoClip,
    TextClip,
)


def load_images(image_dir, count=10):
    images = list(Path(image_dir).glob("*"))
    if not images:
        raise FileNotFoundError(f"No images found in {image_dir}")

    clips = []
    for i in range(count):
        img_path = images[i % len(images)]
        clip = ImageClip(str(img_path)).set_duration(5)
        # Resize to vertical 9:16 (1080x1920)
        clip = clip.resize(height=1920)
        clip = clip.resize(width=1080)
        clip = clip.set_position("center")
        clips.append(clip)
    return clips


def load_subtitles(text_path, count=10):
    lines = []
    if Path(text_path).exists():
        with open(text_path, encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip()]
    if not lines:
        lines = ["Subtitle"] * count
    while len(lines) < count:
        lines.append(lines[len(lines) % len(lines)])
    return lines[:count]


def choose_music(song_dir):
    songs = list(Path(song_dir).glob("*"))
    if not songs:
        return None
    return random.choice(songs)


def create_video(image_dir="data/image", song_dir="song", text_path="data/nature.md"):
    clips = load_images(image_dir, count=10)
    subtitles = load_subtitles(text_path, count=len(clips))

    # add subtitles to each clip
    subbed_clips = []
    for clip, text in zip(clips, subtitles):
        txt_clip = TextClip(
            text,
            fontsize=60,
            font="DejaVu-Sans",
            color="white",
            stroke_color="black",
            stroke_width=2,
            bg_color="black",
            method="caption",
            size=clip.size,
        ).set_position("center").set_duration(clip.duration)
        subbed_clips.append(CompositeVideoClip([clip, txt_clip]))

    video = concatenate_videoclips(subbed_clips)
    music_path = choose_music(song_dir)
    if music_path:
        audio = AudioFileClip(str(music_path)).subclip(0, video.duration)
        video = video.set_audio(audio)

    # ensure results directory
    results = Path("results")
    results.mkdir(exist_ok=True)
    outfile = results / f"{datetime.now().strftime('%Y%m%d_%H%M')}.mp4"
    video.write_videofile(str(outfile), fps=24, codec="libx264", audio_codec="aac")
    print(f"Saved video to {outfile}")


if __name__ == "__main__":
    create_video()
