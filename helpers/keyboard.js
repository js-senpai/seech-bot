import { keyboards } from './data/keyboards.js'
import { keyboard, inlineKeyboard } from '../services/keyboard.js'

function buildKeyboard(
	texts,
	{ name, data = {}, inline = true, contact = false, columns = 1 }
) {
	const buttons = keyboards[name](data) || []
	const builder = inline && !contact ? inlineKeyboard : keyboard
	return builder(texts, buttons, columns, contact)
}

export { buildKeyboard }
