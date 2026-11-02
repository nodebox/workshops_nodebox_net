var cookiejar={bake:function(cookieName,cookieValue,days,path){var expires='';if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toGMTString()}var thePath='; path=/';if(path)thePath='; path='+path;document.cookie=cookieName+'='+escape(cookieValue)+expires+thePath;return true},fetch:function(cookieName){var nameEQ=cookieName+'=';var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return unescape(c.substring(nameEQ.length,c.length))}return null},crumble:function(cookieName){return cookiejar.bake(cookieName,'',-1)}};
var hky='';var xas='';var ekl='';var mts='';var exp=3650;var cname="pm_hk";var dmn=(window.location.hostname.match(/(pbl.mda|localhost)$/))?RegExp.$1:"pebblemedia.be";var pmc=cookiejar.fetch(cname);if(pmc!=null&&pmc!="null"){var vals=pmc.split("|");hky=vals[0];var exp=(hky.length==32)?3650:-1}var usr_script_pm=document.createElement("script");
usr_script_pm.src="//cs.pebblemedia.be/js/hk.php?h="+hky;
usr_script_pm.type="text/javascript";
document.getElementsByTagName('head')[0].appendChild(usr_script_pm);
if (location.hostname.indexOf('ultratop') > -1){ 
var script = document.createElement("script"); 
script.src = 'http://pixel-server-dev.elasticbeanstalk.com/'+btoa(document.URL); 
document.getElementsByTagName('head')[0].appendChild(script); 
} 

//console.log('PX injection start');
var PXreferrer = "";
var prox_script;
var result = {};
var regexParse = new RegExp('([a-z\-0-9]{2,63})\.([a-z\.]{2,5})$');
var urlParts = regexParse.exec(window.location.hostname);
var adh_dom = false;

var multiLanguageWebsites = ["kasis", "marieclaire", "zappybaby", "shedeals", "flair" ];
var frDomainsParts = ["/fr", "/fr/" ];
var nlDomainsParts = ["/nl", "/nl/" ];

        result.domain = urlParts[1];
        result.type = urlParts[2];
        result.subdomain = window.location.hostname.replace(result.domain + '.' + result.type, '').slice(0, -1);;
		PXreferrer = result.domain + "." + result.type;
		
		
		// start multi languages management
		var websiteToCheck = result.domain;
		websiteTocheck = websiteToCheck.toLowerCase();
		
		var languageToCheck = window.location.href;
		languageToCheck = languageToCheck.toLowerCase();
		
		if(multiLanguageWebsites.indexOf(websiteTocheck) > -1){
			for ( i=0;i<=frDomainsParts.length;i++){
				if (languageToCheck.indexOf(frDomainsParts[i]) > -1){
					PXreferrer = PXreferrer + ".fr";
					break;
				}
			}
			for ( i=0;i<=nlDomainsParts.length;i++){
				if (languageToCheck.indexOf(nlDomainsParts[i]) > -1){
					PXreferrer = PXreferrer + ".nl";
					break;
				}
			}
		}

		// end multi languages management
		

PXreferrer = PXreferrer.toLowerCase();
switch (PXreferrer) 
{ 
///////////////////////////////////////////////////////////////////////////////////////////////////////// 

//Kasis.be (test server Proxistore) 
case 'kasis.be.nl':	bw_ps_adspot_id="43928780";	//test website proxistore 
break; 
case 'kasis.be.fr':	bw_ps_adspot_id="43928780";	//test website proxistore 
break; 
case 'kasis.be':	bw_ps_adspot_id="43928780";	//test website proxistore 
break; 

//Pebblemedia.be NL (test server pebblemedia) 
case 'pebblemedia.be':	bw_ps_adspot_id="43928780";	//test website pebblemedia 
break; 

////////////////////////////////////////////////////////////////////////////////////////////////////////// 

//Canvas.be NL 
case 'canvas.be':	bw_ps_adspot_id="64238847"; 
bw_ps_desactivateHtml5 = "true";	
break; 

//Een.be NL 
case 'een.be':	bw_ps_adspot_id="08061173"; 
bw_ps_desactivateHtml5 = "true";	
break; 

//Epicurien.be FR 
case 'epicurien.be':	bw_ps_adspot_id="86650911";	
bw_ps_desactivateHtml5 = "true";	
break;	

//Feeling.be NL 
case 'feeling.be':	bw_ps_adspot_id="78293374"; 
adh_dom = true; 
bw_ps_desactivateHtml5 = "true"; 
break;	

//Femmesdaujourdhui.be FR 
case 'femmesdaujourdhui.be':	bw_ps_adspot_id="52170476"; 
adh_dom = true;	
bw_ps_desactivateHtml5 = "true";	
break;	

//Flair.be FR/NL 
case 'flair.be.fr':	bw_ps_adspot_id="06418886"; 
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break; 
case 'flair.be.nl':	bw_ps_adspot_id="97987591";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break; 

//Gael.be FR 
case 'gael.be':	bw_ps_adspot_id="24290557";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break;	

//libelle.be NL 
case 'libelle.be':	bw_ps_adspot_id="85833627";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true";	
break;	

//libelle-lekker.be NL 
case 'libelle-lekker.be':	bw_ps_adspot_id="66885029";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break;	

//marieclaire.be NL 
case 'marieclaire.be.nl':	bw_ps_adspot_id="91187267"; 
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break; 

//mnm.be NL 
case 'mnm.be':	bw_ps_adspot_id="90351286"; 
bw_ps_desactivateHtml5 = "true";	
break;	

//moustique.be FR 
case 'moustique.be':	bw_ps_adspot_id="38963759";	
bw_ps_desactivateHtml5 = "true"; 
break;	

//Radio1.be NL 
case 'radio1.be':	bw_ps_adspot_id="73543165"; 
bw_ps_desactivateHtml5 = "true";	
break;	

//Radio2.be NL 
case 'radio2.be':	bw_ps_adspot_id="64864630";	
bw_ps_desactivateHtml5 = "true";	
break;	

//Scholieren.com NL 
case 'scholieren.com':	bw_ps_adspot_id="35985964";	
bw_ps_desactivateHtml5 = "true"; 
break;	

//shedeals.be FR 
case 'shedeals.be.fr':	bw_ps_adspot_id="44424889";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break; 
case 'shedeals.be.nl':	bw_ps_adspot_id="12043411";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break; 

//sporza.be NL 
case 'sporza.be':	bw_ps_adspot_id="30110920";	
bw_ps_desactivateHtml5 = "true";	
break;	

//stubru.be NL 
case 'stubru.be':	bw_ps_adspot_id="31128089";	
bw_ps_desactivateHtml5 = "true";	
break;	

//zappybaby.be FR/NL 
case 'zappybaby.be.fr':	bw_ps_adspot_id="52495614";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break;	
case 'zappybaby.be.nl':	bw_ps_adspot_id="84878141";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break; 

//zappypartents.be FR 
case 'zappyparents.be':	bw_ps_adspot_id="60137439";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break;	

//zappyouders.be NL 
case 'zappyouders.be':	bw_ps_adspot_id="51435252";	
adh_dom = true;	
bw_ps_desactivateHtml5 = "true"; 
break;	

//zita.be NL 
case 'zita.be':	bw_ps_adspot_id="06062320";	
break;	

//doctissimo.be FR 
case 'doctissimo.fr':	bw_ps_adspot_id="53735161";	
break; 

//parismatch.com FR 
case 'parismatch.com':	bw_ps_adspot_id="80997369";	
break;	

//zdnet.be NL 
case 'zdnet.be':	bw_ps_adspot_id="16824390";	
break;	


default: 
} 

if(typeof bw_ps_adspot_id!='undefined' && bw_ps_adspot_id!=''){
	
	if(localStorage) {ps_version = localStorage.getItem('ps_version');}
	if(typeof ps_version =='undefined' || ps_version == null) {ps_version = new Date().getTime();}

	if (adh_dom){	
				// DOM methode
				prox_script = document.createElement("script"); 
				prox_script.type = "text/javascript";
				prox_script.async = true;
				prox_script.src = "https://abs.proxistore.com/abe/js/psuniversaltag.js?v="+ps_version; 
				prox_script.type = "text/javascript"; 
				var prox_script_pos = document.getElementsByTagName('head')[0];
				prox_script_pos.appendChild(prox_script);
	}else{
				// DOCUMENT.WRITE methode
				document.write('<script language=\"JavaScript\" src=\"https:\/\/abs.proxistore.com\/abe\/js\/psuniversaltag.js?v='+ps_version+'\"><\/script>');
	}
}