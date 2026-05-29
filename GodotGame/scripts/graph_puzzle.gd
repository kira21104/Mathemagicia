## graph_puzzle.gd
extends Node2D

const TARGET_SUM := 12

const COLOR_LINE_ACTIVE := Color("4DEEEA")
const COLOR_LINE_WIN    := Color("70FFA0")
const COLOR_HUD_NORMAL  := Color("D4AF37")
const COLOR_HUD_OVER    := Color("FF6B6B")

var _chain: Array = []
var _current_sum: int = 0
var _chain_lines: Array = []
var _dragging := false
var _won := false
var _hud_tween: Tween = null

@onready var drag_line: Line2D       = $DragLine
@onready var lines_container: Node2D = $Lines
@onready var sum_label: Label        = $HUD/SumLabel
@onready var reset_button: Button    = $HUD/ResetButton

func _ready() -> void:
	drag_line.visible = false
	drag_line.width = 3.0
	drag_line.default_color = COLOR_LINE_ACTIVE

	reset_button.pressed.connect(_on_reset_button_pressed)

	var nodes := _get_puzzle_nodes()
	print("Found nodes: ", nodes.size())
	for node in nodes:
		node.mouse_entered.connect(_on_node_hovered.bind(node))
		node.mouse_exited.connect(_on_node_unhovered.bind(node))

	for i in nodes.size():
		nodes[i].animate_appearance(i * 0.15)

	_update_hud()

# ── Ввод ────────────────────────────────────────────────────────────────────

func _input(event: InputEvent) -> void:
	if _won:
		return

	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		get_viewport().set_input_as_handled()
		if event.pressed:
			_try_start_drag()
		else:
			if _dragging:
				_finish_drag()

func _process(_delta: float) -> void:
	if not _dragging:
		return
	drag_line.set_point_position(1, get_global_mouse_position())

	# Подсвечиваем узел под мышью
	var hovered := _get_node_at_mouse()
	for node in _get_puzzle_nodes():
		if node == hovered and not _chain.has(node):
			node._on_mouse_entered()
		elif not node.is_hovered:
			pass  # _on_mouse_exited уже сработал через сигнал Area2D

# ── Начало перетаскивания ───────────────────────────────────────────────────

func _try_start_drag() -> void:
	var node := _get_node_at_mouse()
	print("_try_start_drag node=", node, " chain=", _chain.size())
	if node == null:
		return
	if _chain.size() > 0 and node != _chain.back():
		return

	_dragging = true

	if _chain.is_empty():
		_chain.append(node)
		_current_sum += node.number
		node.set_in_chain(true)
		_update_hud()

	var center: Vector2 = node.get_center()
	print("drag_line visible=true center=", center)
	drag_line.clear_points()
	drag_line.add_point(center)
	drag_line.add_point(center)
	drag_line.visible = true

func _finish_drag() -> void:
	_dragging = false
	drag_line.visible = false

	var target := _get_node_at_mouse()
	if target != null and not _chain.has(target):
		var candidate_sum: int = _current_sum + target.number
		if candidate_sum > TARGET_SUM:
			_update_hud(true)
			await get_tree().create_timer(0.35).timeout
			_reset_chain()
		else:
			_append_to_chain(target)
			_update_hud()
			if _current_sum == TARGET_SUM:
				_on_win()

# ── Ховер ────────────────────────────────────────────────────────────────────

func _on_node_hovered(node: Area2D) -> void:
	node.is_hovered = true

func _on_node_unhovered(node: Area2D) -> void:
	node.is_hovered = false

# ── Определить узел под мышью ───────────────────────────────────────────────

func _get_node_at_mouse() -> Area2D:
	var mouse := get_global_mouse_position()
	var space := get_world_2d().direct_space_state
	var query := PhysicsPointQueryParameters2D.new()
	query.position = mouse
	query.collide_with_areas = true
	query.collide_with_bodies = false
	var results := space.intersect_point(query)
	for r in results:
		var collider = r["collider"]
		if collider is Area2D and collider.get_script() != null:
			return collider as Area2D
	return null

# ── HUD ──────────────────────────────────────────────────────────────────────

func _update_hud(flash_over: bool = false) -> void:
	sum_label.text = "%d / %d" % [_current_sum, TARGET_SUM]

	if _hud_tween and _hud_tween.is_valid():
		_hud_tween.kill()
	_hud_tween = create_tween()

	if flash_over:
		_hud_tween.tween_property(sum_label, "modulate", Color(COLOR_HUD_OVER), 0.08)
		_hud_tween.tween_property(sum_label, "modulate", Color(COLOR_HUD_NORMAL), 0.35) \
			.set_ease(Tween.EASE_OUT)
	else:
		_hud_tween.tween_property(sum_label, "scale", Vector2(1.15, 1.15), 0.08) \
			.set_trans(Tween.TRANS_SINE)
		_hud_tween.tween_property(sum_label, "scale", Vector2.ONE, 0.18) \
			.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
		_hud_tween.parallel().tween_property(sum_label, "modulate", Color(COLOR_HUD_NORMAL), 0.08)

# ── Цепочка ──────────────────────────────────────────────────────────────────

func _append_to_chain(to_node: Area2D) -> void:
	var from_node: Area2D = _chain.back()
	_current_sum += to_node.number
	_chain.append(to_node)
	to_node.set_in_chain(true)

	var line := Line2D.new()
	line.width = 3.0
	line.default_color = COLOR_LINE_ACTIVE
	line.add_point(from_node.get_center())
	line.add_point(to_node.get_center())
	lines_container.add_child(line)
	_chain_lines.append(line)

# ── Победа ───────────────────────────────────────────────────────────────────

func _on_win() -> void:
	_won = true
	reset_button.visible = false

	for line in _chain_lines:
		var tween := create_tween()
		tween.tween_property(line, "default_color", COLOR_LINE_WIN, 0.4).set_ease(Tween.EASE_OUT)

	for node in _chain:
		node.set_win()

	sum_label.text = "✓ %d" % TARGET_SUM
	var tween := create_tween()
	tween.tween_property(sum_label, "modulate", Color(COLOR_LINE_WIN), 0.4)
	tween.parallel().tween_property(sum_label, "scale", Vector2(1.2, 1.2), 0.25) \
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(sum_label, "scale", Vector2.ONE, 0.2) \
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

# ── Сброс ────────────────────────────────────────────────────────────────────

func _on_reset_button_pressed() -> void:
	if _won:
		return
	_reset_chain()

func _reset_chain() -> void:
	_dragging = false
	drag_line.visible = false

	for line in _chain_lines:
		var tween := create_tween()
		tween.tween_property(line, "modulate:a", 0.0, 0.25).set_ease(Tween.EASE_IN)
		tween.tween_callback(line.queue_free)

	for node in _chain:
		node.animate_reset()

	_chain.clear()
	_chain_lines.clear()
	_current_sum = 0
	_update_hud()

# ── Вспомогательные ─────────────────────────────────────────────────────────

func _get_puzzle_nodes() -> Array:
	return $Nodes.get_children()
