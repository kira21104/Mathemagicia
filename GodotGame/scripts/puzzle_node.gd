## puzzle_node.gd
extends Area2D

@export var number: int = 1

@onready var label: Label = $Label
@onready var circle: ColorRect = $Circle

const COLOR_IDLE  := Color("1a1a2e")
const COLOR_HOVER := Color("4DEEEA")
const COLOR_CHAIN := Color("D4AF37")
const COLOR_WIN   := Color("70FFA0")

var is_hovered := false

func _ready() -> void:
	label.text = str(number)
	input_pickable = true
	_set_color(COLOR_IDLE)
	scale = Vector2.ZERO
	modulate.a = 0.0

func _on_mouse_entered() -> void:
	if circle.color != COLOR_CHAIN:
		_set_color(COLOR_HOVER)

func _on_mouse_exited() -> void:
	if circle.color != COLOR_CHAIN:
		_set_color(COLOR_IDLE)

func set_in_chain(in_chain: bool) -> void:
	_set_color(COLOR_CHAIN if in_chain else COLOR_IDLE)

func set_win() -> void:
	_set_color(COLOR_WIN)
	_pulse_scale()

func reset_visuals() -> void:
	_set_color(COLOR_IDLE)

func get_center() -> Vector2:
	return global_position

func animate_appearance(delay: float) -> void:
	var tween := create_tween()
	tween.tween_interval(delay)
	tween.tween_property(self, "modulate:a", 1.0, 0.4)
	tween.parallel().tween_property(self, "scale", Vector2.ONE, 0.4) \
		.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func _pulse_scale() -> void:
	var tween := create_tween().set_loops(3)
	tween.tween_property(self, "scale", Vector2(1.18, 1.18), 0.18) \
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tween.tween_property(self, "scale", Vector2.ONE, 0.18) \
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

func animate_reset() -> void:
	var tween := create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.2).set_ease(Tween.EASE_IN)
	await tween.finished
	reset_visuals()
	scale = Vector2.ONE
	modulate.a = 1.0

func _set_color(color: Color) -> void:
	if circle:
		circle.color = color
