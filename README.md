# Battleship Game

A TypeScript implementation of the classic Battleship game with drag-and-drop ship placement and AI opponent. This project was created as a learning exercise to practice TypeScript, object-oriented programming, and front-end development.

live link - https://kaloyanrizov28.github.io/BattleShip/
![image](https://github.com/user-attachments/assets/63a1fc25-5332-4e20-8482-0c74ec1f67f5)

## 🚢 Features

- Interactive drag-and-drop ship placement
- Responsive game board with visual feedback
- AI opponent with targeting logic
- Mobile-friendly touch controls
- Real-time battle messages and animations
- Clean, modern UI design

## 🛠️ Technologies Used

- **TypeScript** - For type-safe code and better development experience
- **HTML5/CSS3** - Modern web standards
- **Jest** - Unit testing framework
- **Drag and Drop API** - Native HTML5 drag and drop functionality
- **Touch Events API** - Mobile device support

## 🏗️ Architecture

The project follows object-oriented principles with clear separation of concerns:

- `Ship.ts` - Ship class with hit tracking and sinking logic
- `GameBoard.ts` - Game board management and attack handling
- `Player.ts` - Player management including AI opponent
- `DOMController.ts` - UI rendering and event handling
- `Game.ts` - Main game flow coordination
- `mobileDragAndDrop.ts` - Touch device support for drag and drop
