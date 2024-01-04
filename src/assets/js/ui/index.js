import { fancy, qs, sw } from "../libs"

export async function Ui(){
	run_widgets()
	await fancy.load()
	Fancybox.bind('[data-fancybox]', {});
}


async function run_widgets(){
	await sw.load()

	let port = qs('.widget.portfolio')
	if(port){
		let options = {
			slidesPerView: 3,
			spaceBetween: 24,
			navigation: {
        nextEl: qs(".next",port),
        prevEl: qs(".prev",port),
      },
		}
		sw.init(qs('.swiper', port), options)
	}

}