import { fancy, load_toast, qs, qsa,sw, xml } from "../libs";
import { highlight } from "../libs";
export async function Ui() {
	run_widgets();
	await fancy.load();
	Fancybox.bind("[data-fancybox]", {});

	mobile_menu();
	high()
	cb_form.listen()
	modals()
}

async function run_widgets() {
	await sw.load();

	let port = qs(".widget.portfolio");
	let circles_mobile = qs("#circles.mobile");
	let fun = qs('.widget.fun')
	let features_slider = qs('.widget.features.slider')
	let testimonials = qs('.widget.testimonials')

	if (port) {
		let options = {
			slidesPerView: qs('.website-page') ? 2 : 3,
			spaceBetween: 24,
			navigation: {
				nextEl: qs(".next", port),
				prevEl: qs(".prev", port)
			},
			breakpoints: {
				480: {
					slidesPerView: 1,
					spaceBetween: 20
				},
				991: {
					slidesPerView: qs('.website-page') ? 2 : 3,
					spaceBetween: 20
				}
			}
		};
		sw.init(qs(".swiper", port), options);
	}
	if (circles_mobile) {
		let options = {
			slidesPerView: 4,
			//spaceBetween: 20,
			navigation: {
				nextEl: qs(".next", circles_mobile),
				prevEl: qs(".prev", circles_mobile)
			},
			on: {
				init: function () {
					qs('.swiper-wrapper', circles_mobile)
					.classList.remove('oh')
				},
			},
		};
		sw.init(qs(".swiper", circles_mobile), options);
	}

	if(fun){
		let options = { 
			slidesPerView: 1, 
			autoplay: {
				delay: 5000,
			}
		};
		sw.init(qs(".swiper", fun), options);
	}
	if(features_slider){
		let options = { 
			slidesPerView: 1, 
			navigation: {
				nextEl: qs(".next", features_slider),
				prevEl: qs(".prev", features_slider)
			},
		};
		sw.init(qs(".swiper", features_slider), options);
	}

	if(testimonials){
		let options = { 
			slidesPerView: 1,
			navigation: {
				nextEl: qs(".next", testimonials),
				prevEl: qs(".prev", testimonials)
			},
		};
		sw.init(qs(".swiper", testimonials), options);
	}

}

function mobile_menu() {
	let icon = qs("#nav-icon1");
	let nav = qs('header nav')
	let underlay = qs('.underlay', nav)
	let ul = qs('ul', nav)
	if (!icon) {
		console.error("НЕТ МОБИЛЬНОГО МЕНЮ?");
		return;
	}
	let h = document.body.scrollHeight
	icon.listen("click", _ => {
		icon.classList.toggle("open")
		nav.classList.toggle("open")
		underlay.style.height=`${h-69}px`
		ul.style.height=`${h-69}px`
		!icon.classList.contains('open')
			&& (underlay.style.height = 0, ul.style.height=0)
	});
	
	underlay.listen("click",_ => icon.click())
}

async function high(){
	if(!qs('.article-page')) return
	await highlight.load()
	highlight.init()
}


const cb_form = {

	form:qs('.widget.callback'),

	async send(){

		let obj = {
			name: qs("[name='name']", this.form).value,
			phone: qs("[name='phone']", this.form).value,
			file: qs('[type="file"]', this.form)?.files[0]
		}


		const formData = new FormData()
		formData.append('files[]', obj.file)
		formData.append("action", "callback");
		formData.append("name", obj.name);
		formData.append("phone", obj.phone);
		let path = process.env.NODE_ENV == 'development'
			? 'http://new.ashaev.by/assets/api/'
			: '/assets/api/'

		if(!await this.validate(obj)) return
		await load_toast()

		try {
			
			let res = await fetch(path, {method: 'POST',body: formData}).then(r => r.json())
			
			if(!res.success){
				res.message
				? new Snackbar(res.message)
				: new Snackbar("Что-то пошло не так")
			} else {
				this.form_clean()
				new Snackbar("👌 Спасибо! Успешно отправлено")
			}

		
		} catch(e){
			new Snackbar(e)
		}
		


	},

	async validate(obj){
		let result = true
		if(obj.file == undefined) return result
		// input file-а может не быть в форме
		// или тз могут не захотеть прислать

		let allowed_filetypes = new Set([
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		])

		if(!allowed_filetypes.has(obj.file.type)){
			await load_toast()
			new Snackbar("Неразрешенный тип файла")
			result = false
		}

		if(obj.file.size > 5 * 1024 * 1024){
			await load_toast()
			new Snackbar("Файл весит больше 5 Мб")
			result = false
		}
		
		return result
		
	},

	form_clean(){
		let inputs = [...qsa('input[type="text"]', this.form), qs('input[type="file"]', this.form)]
		inputs.forEach(i => i && (i.value=''))
	},
	
	listen(){

		if(!this.form) return
		let f = qs('form', this.form)
		

		f.listen("submit", async e => {
			e.preventDefault()
			await load_toast()
			this.send()
		})

		qs('[type="file"]',f)?.listen("change", e => {
			let file = e.target.files[0]
			file
			? qs('.txt',f).innerHTML = file.name
			: qs('.txt',f).innerHTML = "Файл не выбран"
		})

	}
}

function modals(){
	let cb_modal = qs('.modal.cb')
	let discount_modal = qs('.modal.discount')
	

	// callback popup

	let cb_trigger = qs('nav li.cb')
	let get_know_price_trigger = qs('#content .redbutton');

	[cb_trigger, get_know_price_trigger].forEach(el => 
		el?.listen("click", _ => cb_modal.classList.add('open')))

	qs('.close', cb_modal).listen("click", _ => 
		cb_modal.classList.remove('open'))

	// discount popup	

	qs("#discount .cta")?.listen("click", _ =>
		discount_modal.classList.add('open') )
	
	qs('.close', discount_modal)?.listen("click", _ => 
		discount_modal.classList.remove('open'))


	// close on empty space	

	document.listen("click", e => {
		
		if(qs('.modal-content',discount_modal).contains(e.target)) return
		if(qs('.modal-content',cb_modal).contains(e.target)) return

		if(
			e.target == cb_trigger || 
			e.target == qs("#discount .cta") ||
			e.target == get_know_price_trigger
			 ) return
		qsa('.modal').forEach(el => el.classList.remove('open'))
	})

	// close by esc

	document.listen("keyup", e => {
		e.keyCode == 27
		&& qsa('.modal').forEach(el => el.classList.remove('open'))
	})

	// to server

	qsa('.modal form').forEach(el => {
		el.listen("submit", async (e) => {
			e.preventDefault()

			let o = {
				phone: qs('[type=text]',e.target).value,
				type: e.target.closest('.discount') ? 'discount': 'cb'
			}

			await load_toast()

			try {
				
				let res = await xml("callback",o,"/api").then(r => JSON.parse(r))
				res.success
				? (
						new Snackbar("👌 Успешно отправлено"),
						qs('[type=text]',e.target).value='',
						setTimeout(()=>qsa('.modal').forEach(el => el.classList.remove('open')),2000)
					)
				: new Snackbar("❌ Ошибка отправки")
			} catch(e){
				new Snackbar(e)
			}
			
			
		})
	})
}