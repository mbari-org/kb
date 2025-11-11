# UI Constants

This directory contains all UI text strings used throughout the application, organized by category.

## Files

- **concept.js** - UI text for concept-related strings (labels, dropdown options)
- **labels.js** - Button labels and action text
- **processing.js** - Status messages during operations (loading, saving, deleting, etc.)
- **resetting.js** - Text for reset/staged group headers
- **tooltip.js** - Tooltip and help text with delay configuration
- **index.js** - Exports all UI constants for convenience

## Usage

### Direct import from specific module:
```javascript
import { UI_LABELS } from '@/lib/constants/ui/labels'
```

### Import from main constants:
```javascript
import { UI_LABELS, UI_PROCESSING, UI_TOOLTIP } from '@/lib/constants'
```

### Using UI_TEXT aggregate:
```javascript
import { UI_TEXT } from '@/lib/constants/uiText'
```

## Organization

All UI text strings are organized hierarchically within their respective modules:
- Button labels are grouped under `BUTTON`
- Concept-related text is grouped under `CONCEPT`
- Tooltip text is grouped by feature (HISTORY, REFERENCES, TEMPLATES, USERS)
- Processing messages are top-level strings
- Resetting confirmations and staged group headers are top-level strings

## Adding New UI Text

1. Identify the category of your UI text
2. Add it to the appropriate file in `constants/ui/`
3. Export it from the file
4. Update `index.js` if creating a new category
5. Update `uiText.js` if the new text should be included in the `UI_TEXT` aggregate
