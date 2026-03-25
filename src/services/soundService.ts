import MidiPlayer from 'midi-player-js';
import Soundfont from 'soundfont-player';

class SoundService {
  private ctx: AudioContext | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private pulseOsc: OscillatorNode | null = null;
  private pulseGain: GainNode | null = null;
  private bgMusicOsc: OscillatorNode | null = null;
  private bgMusicGain: GainNode | null = null;
  private midiPlayer: any = null;
  private soundfontInstrument: any = null;
  private initMidiPromise: Promise<void> | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private async initMidi() {
    this.init();
    if (this.midiPlayer && this.soundfontInstrument) return;
    if (this.initMidiPromise) return this.initMidiPromise;

    this.initMidiPromise = (async () => {
      try {
        // Load instrument (Piano as default for MIDI)
        // Using a more reliable soundfont source
        this.soundfontInstrument = await Soundfont.instrument(this.ctx!, 'acoustic_grand_piano', {
          soundfont: 'MusyngKite'
        });

        // Initialize MIDI player
        this.midiPlayer = new MidiPlayer.Player((event: any) => {
          if (event.name === 'Note on' && event.velocity > 0) {
            this.soundfontInstrument.play(event.noteName, this.ctx!.currentTime, {
              gain: event.velocity / 127,
            });
          }
        });

        // Fetch the MIDI file
        const response = await fetch('https://raw.githubusercontent.com/vecinoslaserenachile-cloud/juego-serenito/0bfd480e7c9a2ef87c1b9101276a1a10b0c84c9b/Himno.mid');
        if (!response.ok) throw new Error('Failed to fetch MIDI file');
        const arrayBuffer = await response.arrayBuffer();
        this.midiPlayer.loadArrayBuffer(arrayBuffer);
        console.log('MIDI Anthem loaded successfully');
      } catch (error) {
        console.error('Error loading MIDI:', error);
        this.initMidiPromise = null;
        throw error;
      }
    })();
    return this.initMidiPromise;
  }

  // Atmospheric background music
  playBackgroundMusic() {
    this.init();
    if (this.bgMusicOsc) return;

    const ctx = this.ctx!;
    this.bgMusicGain = ctx.createGain();
    this.bgMusicGain.gain.setValueAtTime(0, ctx.currentTime);
    this.bgMusicGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 5);
    this.bgMusicGain.connect(ctx.destination);

    // Soft ethereal pad
    this.bgMusicOsc = ctx.createOscillator();
    this.bgMusicOsc.type = 'sine';
    this.bgMusicOsc.frequency.setValueAtTime(164.81, ctx.currentTime); // E3
    
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(2, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(this.bgMusicOsc.frequency);
    lfo.start();

    this.bgMusicOsc.connect(this.bgMusicGain);
    this.bgMusicOsc.start();
  }

  stopBackgroundMusic() {
    if (this.bgMusicGain) {
      const now = this.ctx!.currentTime;
      this.bgMusicGain.gain.linearRampToValueAtTime(0, now + 2);
      setTimeout(() => {
        this.bgMusicOsc?.stop();
        this.bgMusicOsc = null;
        this.bgMusicGain = null;
      }, 2100);
    }
  }

  // Hitchcock/Montezuma style suspense: Low drone + Dissonant pulses
  playSuspense() {
    this.init();
    if (this.droneOsc) return;

    const ctx = this.ctx!;
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0, ctx.currentTime);
    this.droneGain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 2);
    this.droneGain.connect(ctx.destination);

    // Deep low drone with more harmonics
    this.droneOsc = ctx.createOscillator();
    this.droneOsc.type = 'sawtooth';
    this.droneOsc.frequency.setValueAtTime(41.20, ctx.currentTime); // Low E1
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    filter.Q.setValueAtTime(8, ctx.currentTime);
    
    this.droneOsc.connect(filter);
    filter.connect(this.droneGain);
    this.droneOsc.start();

    // Rhythmic stressful pulse (Montezuma style) - Enhanced
    this.pulseGain = ctx.createGain();
    this.pulseGain.gain.setValueAtTime(0, ctx.currentTime);
    this.pulseGain.connect(ctx.destination);

    this.pulseOsc = ctx.createOscillator();
    this.pulseOsc.type = 'square';
    this.pulseOsc.frequency.setValueAtTime(82.41, ctx.currentTime); // E2
    
    const pulseFilter = ctx.createBiquadFilter();
    pulseFilter.type = 'lowpass';
    pulseFilter.frequency.setValueAtTime(250, ctx.currentTime);
    
    this.pulseOsc.connect(pulseFilter);
    pulseFilter.connect(this.pulseGain);
    this.pulseOsc.start();

    // Pulse automation: Heartbeat pattern
    const now = ctx.currentTime;
    for (let i = 0; i < 3600; i++) {
      const time = now + i * 1.2;
      // Double beat
      this.pulseGain.gain.setTargetAtTime(0.08, time, 0.01);
      this.pulseGain.gain.setTargetAtTime(0, time + 0.1, 0.05);
      this.pulseGain.gain.setTargetAtTime(0.06, time + 0.3, 0.01);
      this.pulseGain.gain.setTargetAtTime(0, time + 0.4, 0.05);
    }
  }

  stopSuspense() {
    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.droneGain?.gain.linearRampToValueAtTime(0, now + 1);
      this.pulseGain?.gain.linearRampToValueAtTime(0, now + 1);
      
      setTimeout(() => {
        this.droneOsc?.stop();
        this.pulseOsc?.stop();
        this.droneOsc = null;
        this.pulseOsc = null;
        this.droneGain = null;
        this.pulseGain = null;
      }, 1100);
    }
  }

  playSelect() {
    this.init();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playCorrect() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.3);
  }

  playCoin() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.1); // E6
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.4);
  }

  playJump() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.2);
  }

  playWrong() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.8);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.8);
  }

  playPhone() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;

    const ring = (start: number) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.setValueAtTime(440, start);
      osc2.frequency.setValueAtTime(480, start);
      
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
      gain.gain.linearRampToValueAtTime(0.1, start + 0.4);
      gain.gain.linearRampToValueAtTime(0, start + 0.5);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + 0.5);
      osc2.stop(start + 0.5);
    };

    ring(now);
    ring(now + 0.6);
  }

  playAudience() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(1, now);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
    gain.gain.linearRampToValueAtTime(0.1, now + 1.8);
    gain.gain.linearRampToValueAtTime(0, now + 2);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  }

  playPrize() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    
    const playNote = (freq: number, start: number, duration: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
      gain.gain.linearRampToValueAtTime(0.1, start + duration - 0.05);
      gain.gain.linearRampToValueAtTime(0, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Triumphant melody (C Major)
    const melody = [
      { f: 523.25, t: 0, d: 0.4 }, // C5
      { f: 659.25, t: 0.4, d: 0.4 }, // E5
      { f: 783.99, t: 0.8, d: 0.4 }, // G5
      { f: 1046.50, t: 1.2, d: 0.8 }, // C6
      { f: 783.99, t: 2.0, d: 0.4 }, // G5
      { f: 1046.50, t: 2.4, d: 1.2 }, // C6
    ];

    melody.forEach(note => {
      playNote(note.f, now + note.t, note.d, 'triangle');
      // Add harmony
      playNote(note.f * 0.75, now + note.t, note.d, 'sine');
    });
  }

  stopAnthem() {
    if (this.midiPlayer) {
      this.midiPlayer.stop();
    }
  }

  // Real MIDI Anthem of La Serena
  async playAnthem() {
    try {
      await this.initMidi();
      if (this.midiPlayer) {
        this.midiPlayer.stop(); // Ensure it starts from the beginning
        this.midiPlayer.play();
      } else {
        throw new Error('MIDI player not initialized');
      }
    } catch (error) {
      console.error('Error playing MIDI anthem, falling back to simple melody:', error);
      this.playAnthemSting(); // Fallback to a simple melody
    }
  }

  // Short triumphant sting for winning a stage
  playAnthemSting() {
    this.init();
    const ctx = this.ctx!;
    const now = ctx.currentTime;
    const beat = 0.4;

    const playNote = (freq: number, start: number, duration: number, type: OscillatorType = 'triangle', volume = 0.1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.05);
      gain.gain.linearRampToValueAtTime(0, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    const sting = [
      { f: 523.25, t: 0, d: 0.5 },    // C5
      { f: 659.25, t: 0.5, d: 0.5 },  // E5
      { f: 783.99, t: 1.0, d: 0.5 },  // G5
      { f: 1046.50, t: 1.5, d: 1.5 }, // C6
    ];

    sting.forEach(n => {
      const t = now + n.t * beat;
      const d = n.d * beat;
      playNote(n.f, t, d, 'triangle', 0.15);
      playNote(n.f * 0.5, t, d, 'sawtooth', 0.05);
    });
  }
}

export const soundService = new SoundService();
