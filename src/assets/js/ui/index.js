import { fancy, qs, sw } from "../libs";
import { highlight } from "../libs";
export async function Ui() {
	run_widgets();
	await fancy.load();
	Fancybox.bind("[data-fancybox]", {});

	mobile_menu();
	high()
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
			}
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
