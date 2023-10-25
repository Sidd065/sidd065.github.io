let data = jdata;
let side=true;
for(let i=0;i<data.length;i++){
    const timelineitem = document.createElement("div");
    timelineitem.className="timeline-item";
    
    const timelineimg = document.createElement("div");
    timelineimg.className="timeline-img";
    timelineitem.appendChild(timelineimg);
    
    const timelinetran = document.createElement("div");
    if(side){
        timelinetran.className="js--fadeInLeft timeline-content";
    }else{
        timelinetran.className="js--fadeInRight timeline-content";
    }
    side=!side;
    if(data[i].type==1){
        const image= document.createElement("div");
        timelinetran.className+=" timeline-card";
        image.className = "timeline-img-header";
        image.style.background = `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)), url("${data[i].image}") center center no-repeat`;
        image.style.backgroundSize="cover";
        const head = document.createElement("h2");
        head.innerHTML=data[i].title;
        image.appendChild(head);
        timelinetran.appendChild(image);
    }else{
        const head = document.createElement("h2");
        head.innerHTML=data[i].title;
        timelinetran.appendChild(head);
    }
    const date = document.createElement("div");
    date.className="date";
    date.innerHTML=data[i].date;
    timelinetran.appendChild(date);
    if(data[i].type==2){
        const desc = document.createElement("blockquote");
        desc.innerHTML=data[i].desc;
        timelinetran.appendChild(desc);
    }else{
        const desc = document.createElement("p");
        desc.innerHTML=data[i].desc;
        timelinetran.appendChild(desc);
    }
    
    if(data[i].link!="NONE"){
        const button = document.createElement("a");
        button.className="bnt-more";
        button.innerHTML="More";
        button.target ="_blank";
        button.href = data[i].link;
        timelinetran.appendChild(button);
    }
    
    timelineitem.appendChild(timelinetran);
    document.getElementById("timeline").appendChild(timelineitem);
}

$(function(){

  window.sr = ScrollReveal();
  if ($(window).width() < 768) {

  	if ($('.timeline-content').hasClass('js--fadeInLeft')) {
  		$('.timeline-content').removeClass('js--fadeInLeft').addClass('js--fadeInRight');
  	}
  	sr.reveal('.js--fadeInRight', {
	    origin: 'right',
	    distance: '300px',
	    easing: 'ease-in-out',
	    duration: 800,
	  });

  } else {
  	
  	sr.reveal('.js--fadeInLeft', {
	    origin: 'left',
	    distance: '300px',
		  easing: 'ease-in-out',
	    duration: 800,
	  });

	  sr.reveal('.js--fadeInRight', {
	    origin: 'right',
	    distance: '300px',
	    easing: 'ease-in-out',
	    duration: 800,
	  });
  }
  sr.reveal('.js--fadeInLeft', {
	    origin: 'left',
	    distance: '300px',
		  easing: 'ease-in-out',
	    duration: 800,
	  });

	  sr.reveal('.js--fadeInRight', {
	    origin: 'right',
	    distance: '300px',
	    easing: 'ease-in-out',
	    duration: 800,
	  });
});