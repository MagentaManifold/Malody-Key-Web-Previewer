// Malody chart json
export type MalodyChart = {
	meta: {
		id: number,
    creator: string,
    background: string,
    version: string,
    preview: number,
    mode: number,
    song: {
      id: number,
      title: string,
      artist: string,
      file?: string,
      bpm?: number
    },
    mode_ext: {
      column: number,
      bar_begin: number,
      speed: number
    }
	},
  time: {
		beat: BeatPosition,
		bpm: number,
		delay: number
	}[],
	note: Note[]
};

export type BeatPosition = [number, number, number];

export type Note = {
	beat: BeatPosition,
	column?: number,
	endbeat?: BeatPosition,
	type?: number,
	sound?: string,
	offset?: number
}