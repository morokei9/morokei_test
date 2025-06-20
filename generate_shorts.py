import random
from datetime import datetime
from pathlib import Path

from moviepy.editor import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips,
    CompositeVideoClip,
    TextClip,
    vfx,
)

try:
    from gtts import gTTS
except ImportError:  # gTTS is optional
    gTTS = None


def generate_tts(text, lang="vi", outfile="tts.mp3"):
    """Generate Vietnamese speech audio from text."""
    if gTTS is None:
        raise RuntimeError("gTTS is not installed")
    tts = gTTS(text=text, lang=lang)
    tts.save(outfile)
    return Path(outfile)


def search_article(keyword):
    """Placeholder for automatic article search."""
    # TODO: implement web search and article summarization
    return f"Sample script for {keyword}"


def load_images(image_dir, count=10):
    images = [p for p in Path(image_dir).iterdir() if p.is_file()]
    if not images:
        raise FileNotFoundError(f"No images found in {image_dir}")

    clips = []
    for i in range(count):
        img_path = images[i % len(images)]
        clip = ImageClip(str(img_path)).set_duration(5)
        # Resize while keeping aspect ratio then crop/pad to 1080x1920
        clip = clip.resize(height=1920)
        if clip.w > 1080:
            clip = clip.crop(x_center=clip.w / 2, width=1080)
        elif clip.w < 1080:
            clip = clip.on_color(size=(1080, 1920), color=(0, 0, 0), pos=("center", "center"))
        # simple zoom in effect
        clip = clip.fx(vfx.resize, lambda t: 1 + 0.05 * t)
        # fade in/out
        clip = clip.fx(vfx.fadein, 0.5).fx(vfx.fadeout, 0.5)
        clips.append(clip.set_position("center"))
    return clips


def load_subtitles(text_path, count=10):
    lines = []
    if Path(text_path).exists():
        with open(text_path, encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip()]
    if not lines:
        lines = ["Subtitle"] * count
    if len(lines) < count:
        repeats = count // len(lines) + 1
        lines = (lines * repeats)[:count]
    return lines[:count]


def choose_music(song_dir):
    audio_exts = {".mp3", ".wav", ".ogg", ".flac", ".m4a"}
    songs = [p for p in Path(song_dir).iterdir() if p.suffix.lower() in audio_exts]
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
            color="white",
            stroke_color="black",
            stroke_width=2,
            method="caption",
            size=(clip.w * 0.9, None),
        ).set_position("center").set_duration(clip.duration)
        subbed_clips.append(CompositeVideoClip([clip, txt_clip]))

    video = concatenate_videoclips(subbed_clips, method="compose", padding=-0.5)
    music_path = choose_music(song_dir)
    if music_path:
        audio = AudioFileClip(str(music_path)).subclip(0, video.duration)
        video = video.set_audio(audio.volumex(0.3))

    # ensure results directory
    results = Path("results")
    results.mkdir(exist_ok=True)
    outfile = results / f"{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    video.write_videofile(str(outfile), fps=24, codec="libx264", audio_codec="aac")
    print(f"Saved video to {outfile}")


if __name__ == "__main__":
    create_video()
