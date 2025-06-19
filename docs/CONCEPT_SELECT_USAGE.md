# ConceptSelect Component Usage Guide

## Overview

The `ConceptSelect` component is a versatile autocomplete component used throughout the VARS Knowledge Base application for concept selection. It supports three distinct usage scenarios with different behaviors.

## Component Props

### Core Props
- `conceptName` (string): The currently selected concept name
- `disabled` (boolean): Whether the component is disabled
- `doConceptSelected` (function): Callback when a concept is selected
- `label` (string): Label displayed above the autocomplete
- `selectables` (array): Optional list of valid concept names to choose from
- `width` (string/number): Width of the component

### New Control Props
- `updateConceptSelected` (boolean, default: true): Whether to update the global SelectedContext when a concept is selected
- `rightComponent` (string): Type of right component to display ('none', 'nav', 'special')
- `onInputChange` (function): Callback for input changes (useful for search functionality)

## Three Usage Scenarios

### Scenario 1: Navigation/Global Selection (Default)
**Purpose:** Main concept navigation throughout the app
**Behavior:** Updates SelectedContext when a concept is selected
**Examples:** TaxonomySidebar, ReferencesHeaderLeft

```jsx
<ConceptSelect
  conceptName={selectedConcept}
  doConceptSelected={handleConceptSelect}
  rightComponent={NAV_HISTORY}
  // updateConceptSelected={true} // default
/>
```

### Scenario 2: Filter/Form Input (No Global Update)
**Purpose:** Local filtering and form inputs
**Behavior:** Only calls the provided callback, does NOT update SelectedContext
**Examples:** TemplatesHeaderLeft, ReferenceConceptSelect

```jsx
<ConceptSelect
  conceptName={filterConcept}
  doConceptSelected={handleFilter}
  selectables={selectableConcepts}
  updateConceptSelected={false}
/>
```

### Scenario 3: ToConcept Selection (Special Values)
**Purpose:** Template creation where "to concept" can be special values
**Behavior:** Allows special values like 'self' and 'nil' in addition to valid concepts
**Examples:** ToConceptSelect (used in TemplateForm)

```jsx
<ToConceptSelect
  conceptName={template.toConcept}
  doConceptSelected={handleToConceptSelect}
  // updateConceptSelected={false} // set by ToConceptSelect
/>
```

## Special Values

When `rightComponent={SPECIAL}`, the component allows these special values:
- `'self'`: References the same concept
- `'nil'`: No target concept

These values are automatically included in the options list and are considered valid selections.

## Migration Guide

### Before (Implicit Control)
```jsx
// Old way - relied on doConceptSelected return value
const handleConceptSelect = conceptName => {
  handleFilter(conceptName)
  return false // Prevented SelectedContext update
}

<ConceptSelect
  doConceptSelected={handleConceptSelect}
/>
```

### After (Explicit Control)
```jsx
// New way - explicit control
<ConceptSelect
  doConceptSelected={handleFilter}
  updateConceptSelected={false}
/>
```

## Benefits of the New Approach

1. **Explicit Control:** Clear indication of whether SelectedContext should be updated
2. **Simplified Logic:** No need for complex return value handling in callbacks
3. **Better Special Value Support:** Automatic inclusion of special values when appropriate
4. **Consistent API:** All usages follow the same pattern
5. **Easier Maintenance:** Clear separation of concerns between navigation and form usage

## Component Hierarchy

```
ConceptSelect (base component)
├── Standard usage (updateConceptSelected=true)
├── Filter usage (updateConceptSelected=false)
└── ToConceptSelect (wrapper with updateConceptSelected=false, rightComponent=SPECIAL)
``` 