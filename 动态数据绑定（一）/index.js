
class Observer {
	constructor(obj) {
		this.data = obj
		this.wlak(this.data)
	}

	wlak (obj) {
		for (let prop of Object.keys(obj)) {
			let val = obj[prop]
			this.convert(prop, val)
		}
	}

	convert (prop, val) {
		Object.defineProperty(this.data, prop, {
			get () {
				console.log(`你访问了${prop}`)
				return val
			},
			set (newVal) {
				if (val === newVal) {
					return
				}
				console.log(`你设置了${prop}, 新的值为${newVal}`)
				return newVal
			}
		})
	}
}