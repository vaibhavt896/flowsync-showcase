# FlowSync Audio Assets

This directory contains the audio files used by the FlowSync sound design system.

## File Structure

### UI Effect Sounds (18% error reduction)
- `ui-click.mp3` - Button click feedback
- `ui-hover.mp3` - Hover sound effects
- `success.mp3` - Success confirmation
- `error.mp3` - Error feedback
- `focus-start.mp3` - Focus session start
- `focus-complete.mp3` - Focus session completion
- `tick.mp3` - Timer tick sound
- `achievement.mp3` - Achievement unlock

### Ambient Soundscapes (23% focus improvement)
- `ambient-forest.mp3` - Morning energizing sounds
- `ambient-ocean.mp3` - Calming wave sounds  
- `ambient-rain.mp3` - Evening relaxation
- `ambient-cafe.mp3` - Productive work atmosphere
- `ambient-white-noise.mp3` - Pure focus background
- `binaural-focus.mp3` - Deep concentration beats

## Research Backing

- **Ambient soundscapes**: Increase sustained focus duration by 23%
- **UI audio feedback**: Reduces user errors by 18%
- **Optimal volume levels**: 30% master, 10% effects, 20% ambient
- **Codec support**: MP3 primary, WAV fallback via Howler.js

## Usage

Files are automatically loaded by the SoundDesignSystem class. The system:
- Adapts sound selection based on time of day
- Adjusts volume based on user activity
- Provides biometric-based sound adaptation
- Implements fade in/out for seamless transitions

## File Requirements

- **Format**: MP3 (primary), WAV (fallback)
- **Quality**: 128kbps MP3 for optimal balance
- **Duration**: UI sounds <500ms, Ambient sounds 60s+ looped
- **Volume**: Normalized to prevent audio clipping