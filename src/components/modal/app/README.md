# AppModal System

This directory contains utilities for the application-level modal system, completely isolated from panel and concept modal systems.

## Purpose

The AppModal system is designed for application-wide dialogs that are not specific to any panel or feature:

- **Error dialogs** - Global error handling
- **Logout confirmations** - Browser back button handling  
- **System notifications** - Application-wide alerts
- **Global warnings** - Security or system status messages

## Components

### Context & Provider
- `AppModalContext` - React context for modal state
- `AppModalProvider` - Context provider component
- `AppModal` - The actual modal component that renders

### Utilities
- `createAppModal()` - Creates modal configurations

## Usage

```javascript
import createAppModal from '@/components/modal/app/createAppModal'
import AppModalContext from '@/contexts/app/AppModalContext'

const MyComponent = () => {
  const { setModal } = use(AppModalContext)
  
  const showModal = () => {
    const modal = createAppModal({
      Actions: MyActionsComponent,
      Content: MyContentComponent, 
      Title: MyTitleComponent,
      minWidth: 600
    })
    setModal(modal)
  }
}
```

## What NOT to use this for

- **Panel-specific modals** (Templates, References, Users) - Use panel modal providers
- **Concept modals** - Use ConceptModalContext
- **Form dialogs** - Use appropriate panel modal system
- **Data editing** - Use panel-specific modal systems

## Current Usage

- `useProcessError` - Global error handling
- `useBrowserBack` - Logout confirmation on browser back button
- `KbLoading` - Processing state indicator (reads processing flag only)
