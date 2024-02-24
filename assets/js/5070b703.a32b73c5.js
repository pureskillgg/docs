"use strict";(self.webpackChunk_pureskillgg_docs=self.webpackChunk_pureskillgg_docs||[]).push([[922],{3905:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l=n.createContext({}),p=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},d=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),m=p(a),h=r,u=m["".concat(l,".").concat(h)]||m[h]||c[h]||i;return a?n.createElement(u,o(o({ref:t},d),{},{components:a})):n.createElement(u,o({ref:t},d))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var p=2;p<i;p++)o[p]=a[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},4191:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>s,metadata:()=>p,toc:()=>c});var n=a(7462),r=a(3366),i=(a(7294),a(3905)),o=["components"],s={},l="PureSkill.gg Competitive CS:GO Gameplay",p={unversionedId:"datascience/adx/csgo/csds/README",id:"datascience/adx/csgo/csds/README",title:"PureSkill.gg Competitive CS:GO Gameplay",description:"This data set is hosted as a product on the AWS Data Exchange.",source:"@site/docs/datascience/adx/csgo/csds/README.md",sourceDirName:"datascience/adx/csgo/csds",slug:"/datascience/adx/csgo/csds/",permalink:"/datascience/adx/csgo/csds/",draft:!1,editUrl:"https://github.com/pureskillgg/docs/tree/master/docs/datascience/adx/csgo/csds/README.md",tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"CSDS Spec",permalink:"/datascience/adx/cs2/csds/spec"},next:{title:"Revision Stats",permalink:"/datascience/adx/csgo/csds/revisions"}},d={},c=[{value:"License (CC BY-NC-SA 4.0)",id:"license-cc-by-nc-sa-40",level:2},{value:"Attribution",id:"attribution",level:2},{value:"Pricing Information",id:"pricing-information",level:2},{value:"Gaining Access",id:"gaining-access",level:2},{value:"Need Help?",id:"need-help",level:2},{value:"About PureSkill.gg",id:"about-pureskillgg",level:2},{value:"Datasheet",id:"datasheet",level:2},{value:"Data Dictionary",id:"data-dictionary",level:3},{value:"Glossary",id:"glossary",level:3},{value:"Motivation",id:"motivation",level:3},{value:"Composition",id:"composition",level:3},{value:"Collection Process",id:"collection-process",level:3},{value:"Preprocessing, Cleaning, and Labeling",id:"preprocessing-cleaning-and-labeling",level:3},{value:"Uses",id:"uses",level:3},{value:"Distribution",id:"distribution",level:3},{value:"Maintenance",id:"maintenance",level:3}],m={toc:c};function h(e){var t=e.components,s=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},m,s,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"pureskillgg-competitive-csgo-gameplay"},"PureSkill.gg Competitive CS:GO Gameplay"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"This data set is hosted as a ",(0,i.kt)("a",{parentName:"em",href:"https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo"},"product on the AWS Data Exchange"),".")),(0,i.kt)("p",null,"Competitive Counter-Strike: Global Offensive (CS:GO)\nmatch data from matchmaking, FACEIT, and other third-parties.\nContains full player telemetry and timestamped game events.\nThese data are extracted from CS:GO replay files called demos.\nData for each match is split across 33 files, collectively called csds."),(0,i.kt)("p",null,"Please visit ",(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("a",{parentName:"strong",href:"https://docs.pureskill.gg/datascience"},"docs.pureskill.gg/datascience")),"\nfor full introduction to PureSkill.gg data science,\nadditional documentation, and a copy of this document."),(0,i.kt)("h2",{id:"license-cc-by-nc-sa-40"},"License (CC BY-NC-SA 4.0)"),(0,i.kt)("p",null,"Please read through the Data Subscriber Agreement (DSA).\nThe DSA is available on the ",(0,i.kt)("a",{parentName:"p",href:"https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo"},"Product Page")," under the Usage section."),(0,i.kt)("p",null,"The key requirements of DSA state you may not use the data for commercial purposes,\nyou must attribute PureSkill.gg, and you must use the same license for any derived work.\nA ",(0,i.kt)("a",{parentName:"p",href:"https://creativecommons.org/licenses/by-nc-sa/4.0/"},'"human-readable" summary of the license')," is provided by Creative Commons,\nbut this is not a substitute for the DSA."),(0,i.kt)("h2",{id:"attribution"},"Attribution"),(0,i.kt)("p",null,'As outlined in the DSA, if you publish a visualization,\nvideo, text summary, or other transformed version of the data, you must provide attribution.\nWe ask that the shared media contain the text "Data provided by PureSkill.gg."\nwith that exact capitalization.'),(0,i.kt)("p",null,"Please let us know if you publish content derived from the data set\nby sending an email to ",(0,i.kt)("a",{parentName:"p",href:"mailto:contact@pureskill.gg"},"contact@pureskill.gg"),"\nor by contacting us on our ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/discord"},"Discord"),"."),(0,i.kt)("h2",{id:"pricing-information"},"Pricing Information"),(0,i.kt)("p",null,"The dataset is provided free of charge."),(0,i.kt)("p",null,"Downloading the data set will incur standard AWS usage fees.\nFPS Critic Inc., owner of PureSkill.gg, is not liable for any AWS costs you incur."),(0,i.kt)("h2",{id:"gaining-access"},"Gaining Access"),(0,i.kt)("p",null,"We want to understand your amazing project and help you get up and running with the data set.\nWhen you ",(0,i.kt)("a",{parentName:"p",href:"https://aws.amazon.com/marketplace/pp/prodview-v3o7zrt6okwmo"},"subscribe to this data product"),", we will need to approve your subscription request.\nPlease outline your use case in the request and allow a few days for review.\nWe may send a follow up email before confirming your request."),(0,i.kt)("p",null,"Once approved, you can access the developer channels on ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/discord"},"Discord"),", just let us know your Discord username."),(0,i.kt)("h2",{id:"need-help"},"Need Help?"),(0,i.kt)("p",null,"If you have questions, email us at ",(0,i.kt)("a",{parentName:"p",href:"mailto:contact@pureskill.gg"},"contact@pureskill.gg"),"\nor reach out on ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/discord"},"Discord"),"."),(0,i.kt)("h2",{id:"about-pureskillgg"},"About PureSkill.gg"),(0,i.kt)("p",null,"PureSkill.gg provides AI-powered coaching for CS:GO players of all ranks\nto hone their skills, rank up, and dominate the game."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://pureskill.gg/"},"Website")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://pureskill.gg/discord"},"Discord")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.youtube.com/channel/UCmgWqRfvuX94XwbuN9CEu_A"},"YouTube")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.linkedin.com/company/itspureskillgg"},"LinkedIn")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://twitter.com/itspureskillgg"},"Twitter")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.facebook.com/itspureskillgg"},"Facebook")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.instagram.com/itspureskillgg"},"Instagram"))),(0,i.kt)("h2",{id:"datasheet"},"Datasheet"),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"Based on ",(0,i.kt)("a",{parentName:"em",href:"https://arxiv.org/abs/1803.09010"},"Datasheets for Datasets"),".")),(0,i.kt)("h3",{id:"data-dictionary"},"Data Dictionary"),(0,i.kt)("p",null,"A ",(0,i.kt)("a",{target:"_blank",href:a(4765).Z},"Data Dictionary")," is available.\nThis is a standardized CSV file that catalogues all tables and columns in the data set."),(0,i.kt)("h3",{id:"glossary"},"Glossary"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://aws.amazon.com/"},"AWS")," - Amazon Web Services."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://aws.amazon.com/data-exchange"},"ADX")," - AWS Data Exchange."),(0,i.kt)("li",{parentName:"ul"},"DSA - Data Subscriber Agreement.\nFind this in your AWS account under the ADX subscription to this data set."),(0,i.kt)("li",{parentName:"ul"},"PII - Personally Identifiable Information."),(0,i.kt)("li",{parentName:"ul"},"channel - One of the 33 files that combine to make a csds object."),(0,i.kt)("li",{parentName:"ul"},"csds - The name given to the collection of 33 files extracted from a CS:GO demo."),(0,i.kt)("li",{parentName:"ul"},"demo - The name given to the server-recorded stream of event data from a match of CS:GO.\nSometimes ends in the .dem file extension."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/"},"CS:GO")," - Counter-Strike: Global Offensive.\nThe game created by Valve that is played to generate this dataset."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.valvesoftware.com/"},"Valve")," - The company that makes CS:GO."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://steamcommunity.com/"},"Steam")," - The platform created by Valve that CS:GO players use to play the game online."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://www.faceit.com/"},"FACEIT")," - A third-party platform used to play CS:GO online.")),(0,i.kt)("h3",{id:"motivation"},"Motivation"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"For what purpose was the dataset created?"),"\nFor education and machine learning research.\nGameplay data from video games provide a fun and relevant way to learn statistics, programming, and more. Though no specific machine learning problem is defined here,\nwe provide ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/pureskillgg/makenew-pyskill"},"open source tooling")," to create baseline datasets\nthat can include some target for supervised learning or an objective for unsupervised learning.\nSome example machine learning problems include:\nclustering how items are used, building win probability models,\nanalyzing player movement patterns, decision making around economic purchases,\nand finding optimal pathing.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Who created the dataset and on behalf of which entity?"),"\nEthan Batson, William Robert Freeman, and Evan Sosenko for FPS Critic, Inc.,\nwhich produces PureSkill.gg.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Who funded the creation of the dataset?"),"\nFPS Critic, Inc. who produces PureSkill.gg.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Any other comments?"),"\nIf you would like to use the dataset for a different purpose,\nplease reach out to ",(0,i.kt)("a",{parentName:"p",href:"mailto:contact@pureskill.gg"},"contact@pureskill.gg")," or contact us on ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/discord"},"Discord"),"."))),(0,i.kt)("h3",{id:"composition"},"Composition"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"What do the instances that comprise the dataset represent?"),"\nParsed and processed individual matches of CS:GO.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"How many instances are there in total?"),"\nApproximately 60,000 matches of CS:GO with ~250 added each day.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Does the dataset contain all possible instances or is it a sample of instances from a larger set?"),"\nIt is a complete picture of all CS:GO demos available to PureSkill.gg.\nThere are ",(0,i.kt)("a",{parentName:"p",href:"https://steamcharts.com/app/730"},"500,000 people playing CS:GO at any point in a day"),",\nand assuming a match takes 1 hour and 10 players,\nthere are 1.2 million matches played every day.\nThe dataset here is a subset of those matches played by the larger CS:GO community.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"What data does each instance consist of?"),"\nCS:GO demo files are ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/markus-wa/demoinfocs-golang"},"parsed")," and saved as 33 separate channels.\nThe collection of these channels for a match is called csds.\nWe provide an ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/pureskillgg/makenew-pyskill"},"open source SDK")," to work with the csds data.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is there a label or target associated with each instance?"),"\nNo, however we provide an open source tool called ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/pureskillgg/makenew-pyskill"},"makenew-pyskill"),"\nto easily create a view of these matches with a target for machine learning prediction in mind.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is any information missing from individual instances?"),"\nWe are always improving our processing pipeline,\nand some matches may have been processed using older versions of certain programs.\nNotably, older matches from the FACEIT platform are missing information about player ranks.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Are relationships between individual instances made explicit?"),"\nSince we have anonymized player data,\nit is not possible to tell if a player in one match is the same as a player in a different match.\nHowever, since all the data were uploaded by PureSkill.gg users, an individual may appear in many matches. It is not possible to tell who the PureSkill.gg user is with the data provided.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Are there recommended data splits?"),"\nNo, however we provide an open source tool called ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/pureskillgg/makenew-pyskill"},"makenew-pyskill"),"\nto easily create a view of these matches with a target for machine learning prediction.\nOne can split the data however appropriate for the task at hand.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Are there any errors, sources of noise, or redundancies in the dataset?"),"\nThere may be duplicate matches in the dataset.\nThese can be deduplicated by comparing calculated values from the header channel.\nWithin matches, there may be missing ticks and missing events.\nThese are generally rare and non-disruptive, but could interfere with some calculations.\nAny problematic matches can be skipped for most use cases.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is the dataset self-contained, or does it link to or otherwise rely on external resources?"),"\nWithin the dataset, we do not link to external resources.\nHowever, properties of game items, map backgrounds for visualizations, and much more are available online. At present, we do not maintain a current or historical version of such files.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Does the dataset contain data that might be considered confidential?"),"\nNo.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Does the dataset contain data that, if viewed directly, might be offensive, insulting, threatening, or might otherwise cause anxiety?"),"\nYes, but keep in mind this is all video game data.\nOut of an abundance of caution, we list these elements of the dataset that may be inappropriate for younger audiences below.\nCS:GO has a rating by the ",(0,i.kt)("a",{parentName:"p",href:"https://www.esrb.org"},"ESRB")," of ",(0,i.kt)("a",{parentName:"p",href:"https://www.esrb.org/ratings-guide/"},"Mature")," for ",(0,i.kt)("a",{parentName:"p",href:"https://www.esrb.org/ratings/100491/Counter-Strike%3A+Global+Offensive"},"Blood and Intense Violence"),".\nCS:GO is basically a SWAT team simulator.\nThe game includes realistic weapons, bombs, hostages, terrorists, killing, death, and grenades.\nThere are no player names, text chat, or voice chat data in the dataset.\nIt is possible to draw offensive pictures by shooting a wall and if visualized,\nthis may be considered offensive.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Does the dataset relate to people?"),"\nYes, since most of the data was generated by people.\nSome data is generated from bots, but that is rare,\nand bot status is known from the ",(0,i.kt)("inlineCode",{parentName:"p"},"player_personal")," channel.\nNote that this and other channels do not contain any personal information,\nwhich has been removed using ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/pureskillgg/csgo-dsdk/blob/master/pureskillgg_csgo_dsdk/scrubber/scrub_pii.py"},"open source tooling"),".")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Does the dataset identify any subpopulations?"),"\nNot directly.\nHowever, for CS:GO demos from Valve Matchmaking, the server location\nis in the name, and one may infer player region (such as US West, South America, or India).")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Does the dataset contain data that might be considered sensitive in any way?"),"\nNo."))),(0,i.kt)("h3",{id:"collection-process"},"Collection Process"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"How was the data associated with each instance acquired?"),"\nDemos were provided by users of PureSkill.gg.\nWe automatically acquire demos from Steam and FACEIT.\nAutomatic demo acquisition requires a user to connect their account to PureSkill.gg.\nSome users may manually upload demos into the system.\nFor manually uploaded demos, we do not know the actual date they were played,\nso the match_played date is actually the uploaded date.\nThe acquisition method is saved under providence (as user or auto)\nand the server provider is saved under platform (steam, faceit, or unknown).\nBoth of these are in the header channel.\nFrom the ",(0,i.kt)("a",{parentName:"p",href:"https://help.steampowered.com/en/wizard/HelpWithGameIssue/?appid=730&issueid=128"},"Steam help page on API connections")," (requires login):"),(0,i.kt)("blockquote",{parentName:"li"},(0,i.kt)("p",{parentName:"blockquote"},"You can create game authentication codes to allow third-party websites and applications to manage your game without running the actual game client. Third-party websites and applications can use this authentication code to access your match history, your overall performance in those matches, download replays of your matches, and analyze your gameplay."))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"What mechanisms or procedures were used to collect the data ?"),"\nThe CS:GO server records a stream of events from every player and game element into a demo.\nWe then collect the demo file through the APIs described above or through manual upload.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"If the dataset is a sample from a larger set, what was the sampling strategy?"),"\nIt is a full sample of data from PureSkill.gg, except for any demos with errors.\nThis is a subset of the many, many CS:GO matches played every day.\nIt is not guaranteed that this dataset is unbiased because all of the demos come from PureSkill.gg users.\nThis is mitigated by the fact that generally the 9 other players\nin a 10 player match are not PureSkill.gg users.\nThere are thousands of PureSkill.gg users with valid API connections (required to upload data).")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Who was involved in the data collection process and how were they compensated?"),"\nThe data was collected through users of the website PureSkill.gg.\nCloud processing costs were paid by FPS Critic, Inc. who produces PureSkill.gg.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Over what timeframe was the data collected?"),"\n2021-12-01 to present.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Were any ethical review processes conducted?"),"\nNo.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Did you collect the data from the individuals in question directly, or obtain it via third parties or other sources?"),"\nPureSkill.gg users must create an account on PureSkill.gg and connect to Steam or FACEIT APIs\nfrom which we download the CS:GO demo files.\nThe user must either login to FACEIT or provide a unique, non-public key to connect to Steam.\nBoth connections can be revoked at any time.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Were the individuals in question notified about the data collection?"),"\nWe must collect a user's CS:GO demo files to provide our services,\nand they agree to this in the PureSkill.gg ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/site-terms/"},"Terms of Service"),".\nThere is data for players that did not agree to our terms of service.\nSince the processed data we are providing here do not contain anything identifiable\nor that can otherwise be linked back to their Steam account, we include these player's data.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Did the individuals in question consent to the collection and use of their data?"),"\nPureSkill.gg Users agreed to the ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/site-terms/"},"Terms of Service")," and linked their Steam or FACEIT accounts\nwhich gives us access to their CS:GO demo files.\nHowever, people who happen to be playing on the same server did not.\nSince the processed data we are providing here do not contain anything identifiable\nor that can otherwise be linked back to their Steam account, we include these player's data.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"If consent was obtained, were the consenting individuals provided with a mechanism to revoke their consent in the future or for certain uses?"),"\nPureSkill.gg users can disconnect their connections between PureSkill.gg and FACEIT or Steam.\nPureSkill.gg complies with GDPR as outlined in our ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/privacy-policy/"},"Privacy Policy")," which supports entire account deletion.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Has an analysis of the potential impact of the dataset and its use on data subjects been conducted?"),"\nWe have gone through great lengths to prevent any way to identify a person in the dataset.\nIt should be impossible.\nAny attempts to identify people, players' Steam IDs, or online identities\nare not permitted.\nTherefore it will not impact the data subjects."))),(0,i.kt)("h3",{id:"preprocessing-cleaning-and-labeling"},"Preprocessing, Cleaning, and Labeling"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Was any preprocessing/cleaning/labeling of the data done?"),"\nRaw CS:GO demo files are event streams.\nThe events and tables can be accessed with a ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/markus-wa/demoinfocs-golang"},"parser"),".\nThe CS:GO demo files are first processed by our parser,\nand the output of the parser is what we call a replay.\nThe replay is transformed by a Post Parser Processor (PPP)\nwhere we engineer new columns, clean up extraneous round data, and fix certain values.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},'Was the "raw" data saved in addition to the preprocessed/cleaned/labeled data?'),"\nCS:GO demo files are deleted quickly after they are processed.\nIf we need to add new features based on demos,\nwe can update the pipeline and new data will contain the new information.\nSince new matches are streaming in automatically each day,\nit will be sufficient to update that step to create a new dataset with the improved feature.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is the software used to preprocess/clean/label the instances available?"),"\nNot at present, but we may release this in the future."))),(0,i.kt)("h3",{id:"uses"},"Uses"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Has the dataset been used for any tasks already?"),"\nA similar dataset was used to develop machine learning models and other assessments\nfor the main service provided by PureSkill.gg, which is automated coaching.\nAn older, unavailable version of these data were used in\n",(0,i.kt)("em",{parentName:"p"},(0,i.kt)("a",{parentName:"em",href:"https://dl.acm.org/doi/abs/10.1145/3485447.3512277"},"Analyzing the Differences between Professional and Amateur Esports through Win Probability"))," by authors Peter Xenopoulos, William Robert Freeman, and Claudio Silva.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is there a repository that links to any or all papers or systems that use the dataset?"),"\nNot at present, but we may add this later.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"What other tasks could the dataset be used for?"),"\nAside from education and machine learning research,\nthis could be used to analyze the game itself,\nincluding player tendencies and how they shift over time.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is there anything about the composition of the dataset or the way it was collected and preprocessed/cleaned/labeled that might impact future uses?"),"\nNo.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Are there tasks for which the dataset should not be used?"),"\nIt should not be used in any manner that is against the DSA, including but not limited to commercial use and releasing transformed data without attribution.\nSubscribers should not attempt to identify any player's Steam ID or online identities,\nor to download the source demo file."))),(0,i.kt)("h3",{id:"distribution"},"Distribution"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Will the dataset be distributed to third parties outside of the entity on behalf of which the dataset was created?"),"\nThe dataset was created using AWS tooling and it will remain there for distribution.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"How will the dataset be distributed?"),"\nThe data will be distributed on the ADX.\nThe license permits sharing modified versions of the dataset under a specific license.\nSee the DSA for details.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"When will the dataset be distributed?"),"\nStarting on 2022-05-17 with a one month automatically renewing subscription.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Will the dataset be distributed under a copyright or other intellectual property license, and/or under applicable terms of use?"),"\nYes, under the DSA, which has similar terms to the\n",(0,i.kt)("a",{parentName:"p",href:"https://creativecommons.org/licenses/by-nc-sa/4.0/"},"Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0) license"),".\nNote that the DSA is the license, not the Creative Commons website or their generic version of the license.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Have any third parties imposed IP-based or other restrictions on the data associated with the instances?"),"\nWe removed all PII or traces back to any Steam ID or online identities.\nSteam is the platform used to play CS:GO, and while a game account may be anonymous,\nwe have taken great care to remove any possibility of scraping valid Steam IDs or online identifiers\nfrom the data or the ability to download the CS:GO demo file.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Do any export controls or other regulatory restrictions apply to the dataset or to individual\ninstances?"),"\nNo."))),(0,i.kt)("h3",{id:"maintenance"},"Maintenance"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Who will be supporting/hosting/maintaining the dataset?"),"\nFPS Critic, Inc. who produces PureSkill.gg.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"How can the owner/curator/manager of the dataset be contacted (e.g., email address)?"),"\nEmail ",(0,i.kt)("a",{parentName:"p",href:"mailto:contact@pureskill.gg"},"contact@pureskill.gg")," or reach out on ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/discord"},"Discord"),".")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Is there an erratum?"),"\nNot yet.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Will the dataset be updated?"),"\nThe dataset will be updated every day with new data.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"If the dataset relates to people, are there applicable limits on the retention of the data\nassociated with the instances?"),"\nNo")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"Will older versions of the dataset continue to be supported/hosted/maintained?"),"\nWe may delete old, unusable data at our discretion.\nAdditionally, we may delete old data to reduce cost.")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("p",{parentName:"li"},(0,i.kt)("strong",{parentName:"p"},"If others want to extend/augment/build on/contribute to the dataset, is there a mechanism for them to do so?"),"\nPlease email ",(0,i.kt)("a",{parentName:"p",href:"mailto:contact@pureskill.gg"},"contact@pureskill.gg")," or reach out on ",(0,i.kt)("a",{parentName:"p",href:"https://pureskill.gg/discord"},"Discord"),"\nif you want to extend the provided csds files in any manner.\nSubscribers are free to release transformations with restrictions as outlined in the DSA."))))}h.isMDXComponent=!0},4765:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/files/csds_dictionary-23ed2a4e1ecfd2a8eea150878b63212d.csv"}}]);