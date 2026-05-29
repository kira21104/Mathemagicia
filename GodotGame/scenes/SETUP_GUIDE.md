# Как собрать сцену в редакторе Godot 4

## 1. Создай корневую сцену

New Scene → Node2D, переименуй в `GraphPuzzle`
Прикрепи скрипт: `scripts/graph_puzzle.gd`

## 2. Добавь дочерние ноды к GraphPuzzle

```
GraphPuzzle (Node2D)          ← graph_puzzle.gd
├── Nodes (Node2D)            ← просто контейнер, без скрипта
├── Lines (Node2D)            ← контейнер для фиксированных линий
└── DragLine (Line2D)         ← линия при перетаскивании
```

DragLine настройки в инспекторе:
- Width: 3
- Default Color: #4DEEEA
- Visible: false (снять галочку)

## 3. Создай префаб узла (PuzzleNode)

New Scene → Area2D, переименуй в `PuzzleNode`
Прикрепи скрипт: `scripts/puzzle_node.gd`

Дочерние ноды PuzzleNode:
```
PuzzleNode (Area2D)           ← puzzle_node.gd
├── Circle (ColorRect)        ← кружок, размер ~72×72, центрирован (offset -36,-36)
│   └── (в инспекторе)        ← Corner Radius: 36 (чтобы было круглым)
├── Label                     ← цифра внутри
│   └── (в инспекторе)        ← Horizontal/Vertical Align: Center
│                             ← Anchors: Full Rect
└── CollisionShape2D          ← CircleShape2D, Radius: 36
```

Подключи сигналы Area2D в редакторе:
- mouse_entered → _on_mouse_entered  (в скрипте puzzle_node.gd)
- mouse_exited  → _on_mouse_exited
- input_event   → _on_input_event

## 4. Расставь узлы в сцене

Добавь 7 экземпляров PuzzleNode как дочерние к `Nodes`.
Для каждого в инспекторе задай свойство `number` (1–7).
Расположи по экрану вручную или программно в _ready() graph_puzzle.gd.

## 5. Программное расположение (опционально)

Вставь в _ready() graph_puzzle.gd вместо ручного размещения:

```gdscript
var positions := [
    Vector2(200, 200), Vector2(400, 150), Vector2(600, 220),
    Vector2(150, 420), Vector2(400, 400), Vector2(650, 380),
    Vector2(400, 620),
]
var nodes := _get_puzzle_nodes()
for i in nodes.size():
    nodes[i].global_position = positions[i]
```

## 6. Project Settings

Project → Project Settings → Input → убедись, что эмуляция тача включена:
`Input Devices → Pointing → Emulate Touch From Mouse = ON`
(для тестирования мышью на десктопе)
