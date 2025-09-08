# 🔊 FlowSync Sound System

A comprehensive audio experience system for productivity and focus enhancement.

## Overview

The FlowSync sound system provides a rich, customizable audio experience with multiple sound categories, volume controls, and seamless integration with timer events. Users can personalize their productivity environment with carefully selected sounds.

## Features

### 🎵 Sound Categories

1. **Alarm Sounds** - Plays when timer sessions end
   - Bell, Bird, Digital, Kitchen, Wood, Chime, Gong
   - Individual volume control
   - Instant playback on session completion

2. **Ticking Sounds** - Background rhythm during focus sessions
   - Wood, Clock, Digital, Soft, Metronome, None
   - Loops continuously during active sessions
   - Fade in/out transitions

3. **Ambient Sounds** - Atmospheric background for concentration
   - Rain, Forest, Ocean, Cafe, Library, Fireplace, None
   - Creates immersive focus environment
   - Volume-balanced with other sounds

4. **Notification Sounds** - Quick alerts and feedback
   - Gentle, Pop, Ding, Whoosh, Chime
   - Used for session starts and system notifications

### 🎛️ Advanced Controls

- **Individual Volume Control**: 0-100% for each sound category
- **Global Sound Toggle**: Master on/off switch
- **Preview Functionality**: Test sounds before selection
- **Smart Integration**: Automatic playback based on timer state
- **Fade Transitions**: Smooth audio transitions for better UX

## Technical Architecture

### Core Components

```typescript
// Sound Store (Zustand)
/stores/soundStore.ts
- Persistent sound preferences
- Sound options database
- Volume controls
- Global settings

// Audio Service
/services/audioService.ts
- Web Audio API integration
- HTML5 Audio fallback
- Advanced playback controls
- Performance optimization

// Sound Hook
/hooks/useSounds.ts
- Timer integration
- Automatic sound triggers
- State management
```

### UI Components

```typescript
// Settings Interface
/components/settings/SoundSettings.tsx
- Dropdown selectors
- Volume sliders
- Preview buttons
- Real-time testing

// Integration
/components/timer/Timer.tsx
- Automatic sound triggers
- State-based audio control
```

## Audio File Structure

```
public/sounds/
├── alarms/
│   ├── bell.mp3
│   ├── bird.mp3
│   ├── digital.mp3
│   ├── kitchen.mp3
│   ├── wood.mp3
│   ├── chime.mp3
│   └── gong.mp3
├── ticking/
│   ├── wood.mp3
│   ├── clock.mp3
│   ├── digital.mp3
│   ├── soft.mp3
│   └── metronome.mp3
├── ambient/
│   ├── rain.mp3
│   ├── forest.mp3
│   ├── ocean.mp3
│   ├── cafe.mp3
│   ├── library.mp3
│   └── fireplace.mp3
└── notifications/
    ├── gentle.mp3
    ├── pop.mp3
    ├── ding.mp3
    ├── whoosh.mp3
    └── chime.mp3
```

## Usage Examples

### Basic Configuration

```typescript
import { useSoundStore } from '@/stores/soundStore'

const { 
  setAlarmSound, 
  setAlarmVolume,
  setTickingSound 
} = useSoundStore()

// Set wood alarm at 70% volume
setAlarmSound('wood')
setAlarmVolume(70)

// Enable gentle ticking
setTickingSound('soft')
```

### Timer Integration

```typescript
import { useSounds } from '@/hooks/useSounds'
import { useTimer } from '@/hooks/useTimer'

const timerState = useTimer()
const sounds = useSounds(timerState)

// Sounds automatically play based on timer state:
// - Ticking starts when timer runs
// - Ambient plays during focus sessions
// - Alarms play on completion
// - Notifications for session changes
```

### Manual Sound Testing

```typescript
import { audioService } from '@/services/audioService'

// Test an alarm sound
await audioService.testPlay('bell', 80)

// Play background ambient
await audioService.playAmbient('rain', 40)

// Stop all sounds
await audioService.stopAllSounds(true) // with fade
```

## Audio Optimization

### Performance Features

- **Preloading**: All sounds loaded on app start
- **Caching**: Audio buffers cached for instant playback  
- **Web Audio API**: Advanced audio control and processing
- **Fallback Support**: HTML5 Audio for older browsers
- **Memory Management**: Efficient resource cleanup

### Browser Compatibility

- Chrome 66+ (full Web Audio support)
- Firefox 60+ (full Web Audio support)  
- Safari 11.1+ (full Web Audio support)
- Edge 79+ (full Web Audio support)
- Fallback: All browsers with HTML5 Audio

## Sound Design Guidelines

### File Requirements

- **Format**: MP3 (best compatibility) or OGG
- **Quality**: 128-320 kbps
- **Length**: 
  - Alarms: 2-5 seconds
  - Ticking: 1-2 seconds (seamless loop)
  - Ambient: 30+ seconds (seamless loop)
  - Notifications: 0.5-2 seconds

### Audio Processing

- **Normalization**: -12 dB peak
- **Loop Points**: Sample-accurate for ticking/ambient
- **Fade Edges**: 10ms fade in/out to prevent clicks
- **Stereo Width**: Moderate (avoid extreme panning)

## Accessibility

### Features

- **Visual Feedback**: Clear UI indicators for sound states
- **Volume Control**: Granular 0-100% control
- **Sound Disable**: Complete audio bypass option
- **Preview Testing**: Try before apply functionality
- **Keyboard Navigation**: Full keyboard accessibility

### WCAG Compliance

- Meets WCAG 2.1 AA standards
- No auto-playing audio without user consent
- Clear labeling for screen readers
- High contrast UI elements

## Troubleshooting

### Common Issues

**No Sound Playing**
1. Check global sound toggle
2. Verify volume levels > 0
3. Ensure browser allows audio
4. Check audio file paths

**Choppy Playback**
1. Check system audio buffer settings
2. Reduce concurrent sounds
3. Clear browser cache
4. Update audio drivers

**Loop Gaps**
1. Verify audio file loop points
2. Check file format compatibility
3. Re-encode with proper loop metadata

### Debug Mode

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug-audio', 'true')
```

## Future Enhancements

### Planned Features

- **Custom Sound Upload**: User-provided audio files
- **Sound Mixing**: Multiple ambient layers
- **Spatial Audio**: 3D positioning for focus
- **AI Sound Selection**: Smart recommendations
- **Binaural Beats**: Brainwave entrainment
- **Voice Guidance**: Meditation and focus instructions

### API Extensions

- Sound visualization
- Real-time audio analysis
- Dynamic volume adjustment
- Context-aware sound selection

## Contributing

### Adding New Sounds

1. Place audio file in appropriate `/public/sounds/` directory
2. Update sound options in `/stores/soundStore.ts`
3. Test with preview functionality
4. Submit PR with sound description

### Sound Quality Standards

- Professional or high-quality recordings only
- Copyright-free or properly licensed
- Tested across multiple devices
- Documented source and description

---

**Built with ❤️ for focused productivity**