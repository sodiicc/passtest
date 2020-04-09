export class AudioService {
    src: string;
    private player_instance: any;

    // Controls
    playing: boolean = false;
    current_time: number = 0;
    duration: number = 0;

    constructor(src: string) {
        this.src = src;

        this.initPlayer();
    }

    public switchActiveState(): void {
        if (this.playing) {
            this.pause();
        } else {
            this.play();
        }
    }

    public play(): void {
        this.player_instance.play();
        this.playing = true;
    }

    public pause(): void {

        this.player_instance.pause();
        this.playing = false;
    }

    public skip(seconds: number) {
        if (this.player_instance.currentTime + seconds < 0) {
            seconds = -1 * this.player_instance.currentTime;
        }
        if (this.player_instance.currentTime + seconds > this.player_instance.duration) {
            seconds = this.player_instance.duration - this.player_instance.currentTime;
            this.pause();
        }

        this.player_instance.currentTime += seconds;
        this.controlsWorker();
    }

    public getPercent() {
        return this.current_time / this.duration * 100
    }

    public setPercent(percent: number) {
        let position = this.player_instance.duration * percent / 100;
        this.player_instance.currentTime = position;
        this.controlsWorker();
    }

    public setTime(time: number) {
        this.player_instance.currentTime = time;
        this.controlsWorker();
    }

    private initPlayer(): void {
        this.player_instance = new Audio();
        this.player_instance.src = this.src;
        this.player_instance.load();

        this.runWorkers();
    }

    private runWorkers() {
        setInterval(() => this.controlsWorker(), 1000)
    }

    private controlsWorker() {
        this.current_time = this.player_instance.currentTime;
        this.duration = this.player_instance.duration;
        this.playing = (!this.player_instance.paused);
    }
}
