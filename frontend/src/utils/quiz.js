import QuizBlock from '@/components/QuizBlock.vue'
import QuizPlugin from '@/components/QuizPlugin.vue'
import { createApp, h } from 'vue'
import { usersStore } from '../stores/user'
import translationPlugin from '../translation'
import { CircleHelp } from 'lucide-vue-next'

export class Quiz {
	constructor({ data, api, readOnly }) {
		this.data = data
		this.readOnly = readOnly
	}

	static get toolbox() {
		const app = createApp({
			render: () =>
				h(CircleHelp, { size: 18, strokeWidth: 1.5, color: 'black' }),
		})

		const div = document.createElement('div')
		app.mount(div)

		return {
			title: __('Quiz'),
			icon: div.innerHTML,
		}
	}

	static get isReadOnlySupported() {
		return true
	}

	render() {
		this.wrapper = document.createElement('div')
		if (Object.keys(this.data).length) {
			this.renderQuiz(this.data.quiz)
		} else {
			this.renderQuizModal()
		}
		return this.wrapper
	}

	renderQuiz(quiz) {
		if (this.readOnly) {
			const app = createApp(QuizBlock, {
				quiz: quiz,
			})
			app.use(translationPlugin)
			const { userResource } = usersStore()
			app.provide('$user', userResource)
			app.mount(this.wrapper)
			return
		}
		this.wrapper.innerHTML = `<div class='border rounded-md p-10 text-center bg-gray-50 mb-2'>
            <span class="font-medium">
                Quiz: ${quiz}
            </span>
        </div>`
		return
	}

	renderQuizModal() {
		if (this.readOnly) {
			return
		}
		const app = createApp(QuizPlugin, {
			onQuizAddition: (quiz) => {
				this.data.quiz = quiz
				this.renderQuiz(quiz)
			},
		})
		app.use(translationPlugin)
		app.mount(this.wrapper)
	}

	save(blockContent) {
		return {
			quiz: this.data.quiz,
		}
	}
}