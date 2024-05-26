import Phaser from "phaser";
import { MalodyChart, Note } from "../types";

export default class Previewer extends Phaser.Scene {
  constructor() {
    super("PreviewerScene");
  }

  async preload() {
    this.load.json("chart", "assets/chart/Key4Beginner.mc");

    this.load.image("note", "assets/skin/note.png");
  }

  create() {
    const chart: MalodyChart = this.cache.json.get("chart");

    let soundNote: Note;
    try {
      soundNote = chart.note.filter((note) => {
        return note.type && note.type === 1;
      })[0];
    } catch (error) {
      throw new Error("failed to find soundNote");
    }
    console.log(soundNote);

    const musicUrl = "assets/chart/" + soundNote.sound;
    this.load.audio("music", musicUrl);

    const backgroundUrl = "assets/chart/" + chart.meta.background;
    this.load.image("background", backgroundUrl);

    this.load.start();

    this.load.on("filecomplete", () => {
      this.startScene();
    });
  }
  scrollSpeed: number = 200;

  startScene() {
    this.buildBackground();
    const music = this.sound.add("music");
    const chart: MalodyChart = this.cache.json.get("chart");
    console.log(chart);

    

    this.generateNotes(chart);
    music.play()
  }

  buildBackground() {
    const darkFilter = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );
    darkFilter.setDepth(-9);

    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background"
    );
    bg.setScale(this.scale.height / bg.height);
    bg.setDepth(-10);
    
  }
  
  noteSprites: Phaser.GameObjects.Sprite[] = [];
  generateNotes(chart: MalodyChart) {


    const originalBpm = chart.time[0].bpm;
    const distancePerBeat = (this.scrollSpeed * originalBpm) / 60;

    for (const note of chart.note) {
      if (note.column !== undefined) {
        const xPos = (note.column + 0.5) * this.scale.width / 4;
        const yPos =
          this.scale.height -
          ((note.beat[0] + note.beat[1] / note.beat[2]) / 4) * distancePerBeat;
        const noteSprite = this.add.sprite(xPos, yPos, "note");
        noteSprite.setScale(this.scale.width / 4 / noteSprite.width);
        noteSprite.originY = 1;
        this.noteSprites.push(noteSprite);
      }
    }
  }
  presentBpm: number = 100;

  update(time: number, delta: number) {
    for(const note of this.noteSprites) {
      note.setY(note.y + this.scrollSpeed * delta / 1000);
    }
  }
}
