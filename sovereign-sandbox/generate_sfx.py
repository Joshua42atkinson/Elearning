import wave
import math
import struct
import random

def generate_tone(filename, duration, frequency, volume=0.5, type="sine", decay=False):
    num_samples = int(44100 * duration)
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(44100)
        
        for i in range(num_samples):
            t = float(i) / 44100.0
            
            if type == "noise":
                val = random.uniform(-1.0, 1.0)
            elif type == "square":
                val = 1.0 if (t * frequency) % 1.0 > 0.5 else -1.0
            else:
                val = math.sin(2.0 * math.pi * frequency * t)
            
            env = 1.0
            if decay:
                env = max(0.0, 1.0 - (t / duration))
                
            sample = int(val * env * volume * 32767.0)
            wav_file.writeframesraw(struct.pack('<h', sample))

# Hit sound: short high pitched noise
generate_tone("assets/hit.wav", 0.1, 400.0, volume=0.3, type="noise", decay=True)

# Death sound: longer low pitched square
generate_tone("assets/death.wav", 0.4, 150.0, volume=0.4, type="square", decay=True)

# Level up: escalating sine
num_samples = int(44100 * 0.8)
with wave.open("assets/levelup.wav", 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(44100)
    for i in range(num_samples):
        t = float(i) / 44100.0
        freq = 400.0 + (t * 1000.0) # Escalating
        val = math.sin(2.0 * math.pi * freq * t)
        env = 1.0
        if t > 0.6: env = max(0.0, 1.0 - ((t - 0.6) / 0.2))
        sample = int(val * env * 0.3 * 32767.0)
        wav_file.writeframesraw(struct.pack('<h', sample))

print("SFX generated")
