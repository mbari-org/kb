# MBARI VARS KnowledgeBase Editor

A React-based web application for managing the MBARI VARS (Video Annotation and Reference System) knowledge base. This application provides a comprehensive interface for taxonomic concept management, including concept editing, media management, user administration, and reference management.

## 🏗️ Project Overview

### Technology Stack
- **Frontend Framework**: React 19.0.0 with JSX
- **Build Tool**: Vite 6.0.9
- **UI Framework**: Material-UI (MUI) v6.4.0
- **Routing**: React Router DOM v7.1.1
- **HTTP Client**: Axios v1.7.9
- **Package Manager**: Yarn v4.5.1
- **Development**: ES2022+ with ESLint

### Key Features
- 🌲 **Taxonomic Tree Management**: Interactive concept hierarchy navigation
- 📝 **Concept Editing**: Create, edit, and manage taxonomic concepts
- 🖼️ **Media Management**: Associate and manage media files with concepts
- 👥 **User Administration**: Manage system users and permissions
- 📚 **Reference Management**: Handle scientific references and citations
- 📊 **History Tracking**: View concept change history and versioning
- 🔒 **Authentication**: Secure login with JWT tokens
- 📱 **Responsive Design**: Mobile-friendly interface

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── common/          # Reusable UI components
│   ├── config/          # Configuration forms
│   ├── kb/              # Knowledge base specific components
│   │   ├── panels/      # Main panel components
│   │   │   ├── concepts/ # Concept management
│   │   │   ├── history/  # History tracking
│   │   │   ├── references/ # Reference management
│   │   │   ├── templates/ # Template management
│   │   │   └── users/   # User management
│   │   └── nav/         # Navigation components
│   ├── modal/           # Modal dialogs
│   └── util/            # Utility components
├── contexts/            # React contexts for state management
│   ├── auth/            # Authentication context
│   ├── concept/         # Concept state management
│   ├── config/          # Configuration context
│   ├── modal/           # Modal state management
│   ├── references/      # References context
│   ├── selected/        # Selection state
│   ├── taxonomy/        # Taxonomy data context
│   ├── templates/       # Templates context
│   └── users/           # Users context
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── api/             # API service functions
│   ├── auth/            # Authentication utilities
│   ├── kb/              # Knowledge base models
│   ├── services/        # External service integrations
│   └── store/           # State management stores
└── App.jsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn 4.5.1+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kb
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Start development server**
   ```bash
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173/kbeditor/`

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn build` | Build production bundle |
| `yarn preview` | Preview production build locally |
| `yarn kb` | Build and preview (combined command) |
| `yarn lint` | Run ESLint code analysis |
| `yarn version:generate` | Generate version information |

## 🏗️ Development

### Project Configuration

- **Base URL**: `/kbeditor/`
- **Development Port**: 5173
- **Path Aliases**: `@` maps to `./src`
- **Source Maps**: Enabled in production builds

### Code Standards

- **ESLint**: Configured with React best practices
- **React**: Uses modern hooks and functional components
- **JSX**: Standard JSX syntax
- **ES2022+**: Modern JavaScript features

### State Management

The application uses React Contexts for state management:

- **AuthContext**: User authentication and authorization
- **ConceptContext**: Concept editing and staging
- **TaxonomyContext**: Taxonomic tree data
- **SelectedContext**: Current selections (concepts, history)
- **ModalContext**: Modal dialog state
- **ConfigContext**: Application configuration

### Key Components

#### Main Application Structure
- `App.jsx`: Root component with routing
- `KBContainer.jsx`: Main knowledge base container
- `KnowledgeBase.jsx`: Core KB interface

#### Panel Components
- `Concepts.jsx`: Concept management panel
- `References.jsx`: Reference management
- `Users.jsx`: User administration
- `Templates.jsx`: Template management
- `History.jsx`: Change history tracking

#### Tree Navigation
- `TaxonomyTree.jsx`: Interactive concept tree
- `ConceptTreeItem.jsx`: Individual tree nodes
- `ConceptTreeLabel.jsx`: Tree item labels

### API Integration

API services are organized in `src/lib/api/`:
- `concept.js`: Concept CRUD operations
- `taxonomy.js`: Taxonomic tree operations
- `references.js`: Reference management
- `users.js`: User management
- `media.js`: Media file operations

### Authentication

- JWT-based authentication
- Role-based access control (Read-only, Editor, Admin)
- Automatic token refresh
- Secure route protection

## 🎨 UI/UX

### Design System
- **Material-UI**: Consistent component library
- **Theme**: Custom MBARI-branded theme
- **Typography**: Roboto font family
- **Responsive**: Mobile-first design approach
- **Accessibility**: ARIA compliant components

### Key UI Patterns
- **Panel Layout**: Tabbed interface for different sections
- **Tree Navigation**: Expandable taxonomic hierarchy
- **Modal Dialogs**: Overlay forms for editing
- **Data Grids**: Sortable and filterable tables
- **Form Validation**: Real-time input validation

## 🧪 Testing & Quality

### Code Quality
- ESLint configuration with React rules
- Strict mode enabled
- Error boundaries for graceful error handling
- TypeScript definitions available

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2022+ features required
- JavaScript modules support needed

## 📦 Deployment

### Build Process
```bash
# Production build
yarn build

# Preview build locally
yarn preview
```

### Build Output
- Static files in `dist/` directory
- Source maps included
- Optimized and minified assets
- Base path: `/kbeditor/`

### Environment Configuration
- Development: Vite dev server with HMR
- Production: Static file serving
- API endpoints configurable via context

## 🔧 Customization

### Theme Customization
Modify `src/lib/theme.js` to customize:
- Color palette
- Typography settings
- Component variants
- Spacing and breakpoints

### Adding New Features
1. Create components in appropriate directory
2. Add contexts for state management if needed
3. Implement API services in `src/lib/api/`
4. Update routing in `App.jsx`
5. Add navigation links in appropriate panels

## 📄 License

[Add license information here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

For technical support or questions about MBARI VARS:
- [Add contact information here]
- [Add documentation links here]
