(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{150:function(e,t,a){e.exports={gallery:"Show_gallery__34GpT"}},153:function(e,t,a){e.exports=a(332)},158:function(e,t,a){},159:function(e,t,a){e.exports=a.p+"static/media/logo.5d5d9eef.svg"},160:function(e,t,a){},247:function(e,t){},249:function(e,t){},282:function(e,t){},283:function(e,t){},329:function(e,t){},330:function(e,t){},331:function(e,t){},332:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),o=a(145),c=a.n(o),i=(a(158),a(146)),s=a(147),u=a(151),d=a(148),p=a(152),m=(a(159),a(160),a(34)),l=a(14),b=a.n(l),f=a(26),v=a(6),g=function(e,t){var a=Object(n.useRef)();Object(n.useEffect)(function(){a.current=e},[e]),Object(n.useEffect)(function(){if(null!==t){var e=setInterval(function(){a.current()},t);return function(){return clearInterval(e)}}},[t])},A=a(149),_=a.n(A),h=void 0,P={width:800,height:800,facingMode:"environment"},j=function(e){var t=e.onRef,a=Object(n.useRef)(),o=Object(n.useState)(!1),c=Object(v.a)(o,2),i=c[0],s=c[1],u=function(){var e=Object(f.a)(b.a.mark(function e(){var t;return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){e.next=4;break}throw t="Browser API navigator.mediaDevices.getUserMedia not available",h.setState({error_messages:t}),t;case 4:a.current.video.onloadedmetadata=function(){s(!0)};case 6:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)(function(){u()},[a]),i&&t&&t(a),r.a.createElement(_.a,{audio:!1,ref:a,screenshotFormat:"image/jpeg",videoConstraints:P,height:400,width:400})},E=a(150),R=a.n(E),O=j,C=function(e){var t=e.data;return r.a.createElement("div",{className:R.a.gallery},t&&t.map(function(e,t){return r.a.createElement("img",{key:t,src:e,alt:"img"})}))},w=function(e){var t=e.videoRef,a=e.triggerRecording,o=e.duration,c=e.onComplete,i=e.previewVideo,s="video/webm",u=".mp4",d=Object(n.useState)(""),p=Object(v.a)(d,2),l=p[0],b=p[1],f=Object(n.useState)(5e3),g=Object(v.a)(f,2),A=g[0],_=g[1];Object(n.useEffect)(function(){o&&"number"===typeof o&&_(o)},[o]);var h=Object(n.useState)(!1),P=Object(v.a)(h,2),j=P[0],E=(P[1],Object(n.useState)([])),R=Object(v.a)(E,2),O=(R[0],R[1],Object(n.useState)([])),C=Object(v.a)(O,2),w=C[0],I=C[1];Object(n.useRef)();Object(n.useEffect)(function(){!0===a&&!1===j&&S({duration:A})},[a,j]),Object(n.useEffect)(function(){w.length>0&&(console.log("making linl!",w),i&&D())},[w]);var D=function(){var e=new Blob(w,{type:s}),t=URL.createObjectURL(e),a=r.a.createElement("li",{key:t},r.a.createElement("video",{height:200,controls:!0,src:t}),r.a.createElement("br",null),r.a.createElement("a",{href:t,download:"video".concat(u)},"download ".concat("video".concat(u))));b([].concat(Object(m.a)(l),[a]))},S=function(e){if(e.duration,t){var a=t.current.stream;a.active||console.log("media stream is not active.",a);var n=new MediaRecorder(a);n.ondataavailable=function(e){I([e.data]),c&&c(e.data)},n.onstart=function(e){I([]),setTimeout(function(){n.stop()},A)},n.start()}};return r.a.createElement("ul",{style:{display:"flex",listStyleType:"none",width:"100%",overflowX:"scroll"}},l)},I=a(66),D=a.n(I),S={apiKey:Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"}).apiKey,authDomain:Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"}).authDomain,databaseURL:Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"}).databaseURL,projectId:Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"}).projectId,storageBucket:Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"}).storageBucket,messagingSenderId:Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"}).messagingSenderId},T={};Object.keys(S).map(function(e){T[e]=Object({NODE_ENV:"production",PUBLIC_URL:"/ricecam",REACT_APP_apiKey:"AIzaSyDSwRNP14oYjsb4rJvDjYbANatbaIBDI0A",REACT_APP_authDomain:"operation-verde-ricecam.firebaseapp.com",REACT_APP_databaseURL:"https://operation-verde-ricecam.firebaseio.com",REACT_APP_projectId:"operation-verde-ricecam",REACT_APP_storageBucket:"operation-verde-ricecam.appspot.com",REACT_APP_messagingSenderId:"231640672051"})["REACT_APP_".concat(e)]}),D.a.apps.length||D.a.initializeApp(T);var y=D.a,k=a(23),N=a.n(k);a(244);N.a.locale("ja");var U=function(e){var t=N()().format("YYYY-MM-DDTHH:mm:ss:SSS"),a=y.storage().ref("images/".concat(t,".png")).put(e);console.log(a)},B=a(67),L=function(){var e=Object(f.a)(b.a.mark(function e(){return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,B.a("assets/model/brightness-predictor.json");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),x=function(){var e=Object(f.a)(b.a.mark(function e(t){var a;return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,L();case 2:if(!(a=e.sent)){e.next=7;break}return e.next=6,B.c(function(){var e=[Array.from(t)],n=B.b(e,[e.length,432]);console.log(n);var r=a.predict(n);return r.print(),r.arraySync()[0][0]});case 6:return e.abrupt("return",e.sent);case 7:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),Y=function(){var e=Object(f.a)(b.a.mark(function e(t){var a,n,r;return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.getContext("2d").getImageData(0,0,t.width,t.height),console.log(a),n=a.data,e.next=5,x(n);case 5:return r=e.sent,console.log(r),e.abrupt("return",r>.6);case 8:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),J=function(e){var t=e.videoRef,a=e.isDetecting,r=e.delay,o=e.onDetect,c=Object(n.useState)(500),i=Object(v.a)(c,2),s=i[0],u=i[1];Object(n.useEffect)(function(){r&&"number"===typeof r&&u(r)},[r]),g(function(){d()},a?s:null);var d=function(){var e=Object(f.a)(b.a.mark(function e(){var a,n,r;return b.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=11;break}return a=t.current.video,(n=document.createElement("canvas")).width=12,n.height=9,n.getContext("2d").drawImage(a,0,0,n.width,n.height),e.next=9,Y(n);case 9:r=e.sent,o&&o({bright:r});case 11:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}();return null},K=function(){var e=Object(n.useState)(),t=Object(v.a)(e,2),a=t[0],o=t[1],c=Object(n.useState)(!0),i=Object(v.a)(c,2),s=i[0],u=i[1],d=Object(n.useState)(!1),p=Object(v.a)(d,2),l=p[0],b=p[1],f=Object(n.useState)(!1),A=Object(v.a)(f,2),_=A[0],h=A[1],P=Object(n.useState)(!1),j=Object(v.a)(P,2),E=j[0],R=j[1];g(function(){_?console.log("recording still underway..."):h(!0)},E?3e4:null);var I=Object(n.useState)(1e3),D=Object(v.a)(I,2),S=D[0],T=(D[1],Object(n.useState)(!1)),k=Object(v.a)(T,2),B=k[0];k[1];g(function(){W()},B?S:null);var L=Object(n.useState)([]),x=Object(v.a)(L,2),Y=x[0],K=x[1],V=Object(n.useState)([]),z=Object(v.a)(V,2),H=z[0],M=z[1],W=function(){if(a){var e,t=a.current.video,n=document.createElement("canvas");n.width=1*t.videoWidth,n.height=1*t.videoHeight,(e=n.getContext("2d")).drawImage(t,0,0,n.width,n.height);var r=n.toDataURL();K([].concat(Object(m.a)(Y),[r])),e.clearRect(0,0,n.width,n.height),n.width=.02*t.videoWidth,n.height=.02*t.videoHeight,(e=n.getContext("2d")).drawImage(t,0,0,n.width,n.height);var o=e.getImageData(0,0,n.width,n.height);console.log(o);var c=function(e){var t=[];for(var a in e)t.push(e[a]);return t}(o.data);return M([].concat(Object(m.a)(H),[c])),Y}},F=Object(n.useState)(100),G=Object(v.a)(F,2),X=G[0],$=G[1],q=Object(n.useState)(!1),Q=Object(v.a)(q,2),Z=Q[0],ee=Q[1];g(function(){te()},Z?X:null);var te=function(){if(a){var e=a.current.video,t=document.createElement("canvas");t.width=1*e.videoWidth,t.height=1*e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height);var n=t.toDataURL();K([].concat(Object(m.a)(Y),[n])),t.toBlob(function(e){console.log(e),U(e)})}};return Object(n.useEffect)(function(){if(a){var e=a.current.video;e.height=.1*e.videoHeight,e.width=.1*e.videoWidth,console.log(a.current.video)}},[a]),r.a.createElement("div",{style:{backgroundColor:s?"white":"#282c34"}},r.a.createElement(O,{onRef:o}),r.a.createElement("br",null),r.a.createElement("code",null,"debug buttons: "),r.a.createElement("button",{onClick:function(){Z?(console.log("stopping!"),ee(!1),$(1e3)):(console.log("capturing!"),$(1),ee(!0))}},"toggle stream to database"),r.a.createElement("button",{onClick:function(){b(!l)}},"toggle detection"),r.a.createElement("button",{style:{color:_?"red":"black"},onClick:function(){return h(!_)}},"toggle video recording"),r.a.createElement("button",{onClick:function(){h(!0),R(!0),setTimeout(function(){R(!1)},36e5)}},"record 5 sec videos for 1 hour"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(C,{data:Y}),r.a.createElement(w,{videoRef:a,triggerRecording:_,duration:5e3,previewVideo:!0,onComplete:function(e){console.log(e),function(e){var t=N()().format("YYYY-MM-DDTHH:mm:ss:SSS"),a=y.storage().ref("".concat("videos","/").concat(t,".mp4")).put(e);console.log(a)}(e),h(!1)}}),r.a.createElement(J,{videoRef:a,isDetecting:l,delay:1e3,onDetect:function(e){return u(e.bright)}}))},V=function(e){function t(){return Object(i.a)(this,t),Object(u.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(K,null))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(V,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[153,1,2]]]);
//# sourceMappingURL=main.4f20b136.chunk.js.map