
export default {
    environment: process.env.NODE_ENV,
    INDEX_VIEW_NINE : [
        {id:'1',name:'泵浦狀況',type:'Pump',sort:'1'},
        {id:'2',name:'水位狀況',type:'Waterlevel',sort:'2'},
        {id:'3',name:'升降機運行狀況',type:'Elevator',sort:'3'},
        {id:'4',name:'排煙機狀況',type:'Smoke',sort:'4'},
        {id:'5',name:'發電機狀況',type:'Generator',sort:'5'},
        {id:'6',name:'電源供給狀況',type:'Power',sort:'6'},
        {id:'7',name:'空調主機',type:'Air',sort:'7'},
        {id:'8',name:'待確認8',type:'x',sort:'8'},
        {id:'9',name:'待確認9',type:'x',sort:'9'},
        {id:'10',name:'待確認10',type:'x',sort:'10'},
        {id:'11',name:'待確認11',type:'x',sort:'11'},
        {id:'12',name:'待確認12',type:'x',sort:'12'},
        {id:'13',name:'待確認13',type:'x',sort:'13'},
        {id:'14',name:'待確認14',type:'x',sort:'14'}
    ],
    Equipment:[
        {
            id:'f1',
            name:'室內消防栓',
            type:'FFE_IndoorFireHydrant',
            status:[
                {value:'0',imgSrc:"b/2.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r2.png",color:'#ff0000'}
            ]
        },
        {
            id:'f2',
            name:'室外消防栓',
            type:'FFE_OutdoorFireHydrant',
            status:[
                {value:'0',imgSrc:"b/9.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r9.png",color:'#ff0000'}
            ]
        },
        {
            id:'f3',
            name:'自動撒水',
            type:'FFE_AutomaticSprinklerSystem',
            status:[
                {value:'0',imgSrc:"b/3.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r3.png",color:'#ff0000'}
            ]
        },
        {
            id:'f4',
            name:'泡沫',
            type:'FFE_FoamFireExtinguisher',
            status:[
                {value:'0',imgSrc:"b/5.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r5.png",color:'#ff0000'}
            ]
        },
        {
            id:'f5',
            name:'水霧',
            type:'FFE_WaterMistSystem',
            status:[
                {value:'0',imgSrc:"b/4.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r4.png",color:'#ff0000'}
            ]
        },
        {
            id:'f6',
            name:'惰性氣體',
            type:'FFE_InertGasSystem',
            status:[
                {value:'0',imgSrc:"b/6.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r6.png",color:'#ff0000'}
            ]
        },
        {
            id:'f7',
            name:'鹵化烴',
            type:'FFE_HalohydrocarbonSystem',
            status:[
                {value:'0',imgSrc:"b/7.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r7.png",color:'#ff0000'}
            ]
        },
        {
            id:'f8',
            name:'乾粉',
            type:'FFE_DryPowderSystem',
            status:[
                {value:'0',imgSrc:"b/8.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r8.png",color:'#ff0000'}
            ]
        },
        {
            id:'f9',
            name:'加壓送水裝置',
            type:'PressurizedWater',
            status:[
                {value:'0',imgSrc:"b/22.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r22.png",color:'#00ff00'}
            ],
            action:[
                {value:'0',label:'停止',color:'#00a0e9'},
                {value:'1',label:'啟動',color:'#ff0000'}
            ]
        },
        {
            id:'a1',
            name:'火警授信總機',
            type:'AE_FireDetectorCentralControl',
            status:[
                {value:'0',imgSrc:"b/33.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r33.png",color:'#ff0000'}
            ]
        },
        {
            id:'a2',
            name:'偵煙式探測器',
            type:'AE_SmokeDetector',
            status:[
                {value:'0',imgSrc:"b/10.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r1.png",color:'#ff0000'}
            ]
        },
        {
            id:'a3',
            name:'光電式分離型探測器',
            type:'AE_PhotoelectricSeparationDetector',
            status:[
                {value:'0',imgSrc:"b/11.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r1.png",color:'#ff0000'}
            ]
        },
        {
            id:'a4',
            name:'感熱式探測器',
            type:'AE_ThermalDetector',
            status:[
                {value:'0',imgSrc:"b/14.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r1.png",color:'#ff0000'}
            ]
        },
        {
            id:'a5',
            name:'火焰式探測器',
            type:'AE_FlameDetector',
            status:[
                {value:'0',imgSrc:"b/15.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r1.png",color:'#ff0000'}
            ]
        },
        {
            id:'a6',
            name:'瓦斯漏氣檢知器',
            type:'AE_TileLeakDetector',
            status:[
                {value:'0',imgSrc:"b/17.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r17.png",color:'#ff0000'}
            ]
        },
        {
            id:'a7',
            name:'火警發信機',
            type:'AE_ManualAlarmDevice',
            status:[
                {value:'0',imgSrc:"b/16.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r16.png",color:'#ff0000'}
            ]
        },
        {
            id:'a8',
            name:'緊急廣播設備',
            type:'AE_EmergencyBroadcastDevice',
            status:[
                {value:'0',imgSrc:"b/19.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r19.png",color:'#ff0000'}
            ]
        },
        {
            id:'fp1',
            name:'防火捲門',
            type:'FPE_RollingFireDoor',
            status:[
                {value:'0',imgSrc:"b/24.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r24.png",color:'#00ff00'}
            ],
            action:[
                {value:'0',label:'關',color:'#ff0000'}
            ]
        },
        {
            id:'fp2',
            name:'防火門',
            type:'FPE_FireDoor',
            status:[
                {value:'0',imgSrc:"b/23.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r23.png",color:'#00ff00'}
            ]
        },
        {
            id:'r1',
            name:'防煙垂壁',
            type:'SPE_SmokeBarrier',
            status:[
                {value:'0',imgSrc:"b/25.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r25.png",color:'#00ff00'}
            ],
            action:[
                {value:'0',label:'關',color:'#00a0e9'},
                {value:'1',label:'開',color:'#ff0000'}
            ]
        },
        {
            id:'r2',
            name:'自然排煙窗',
            type:'SPE_NaturalSmokeExhaustWindow',
            status:[
                {value:'0',imgSrc:"b/27.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r27.png",color:'#00ff00'},
                {value:'2',imgSrc:"r/r27.png",color:'#00ff00'}
            ],
            action:[
                {value:'0',label:'關',color:'#00a0e9'},
                {value:'1',label:'開',color:'#ff0000'},
                {value:'2',label:'停止',color:'#ff0000'}
            ]
        },
        {
            id:'r3',
            name:'排煙機',
            type:'RE_SmokeExtractionDevice',
            status:[
                {value:'0',imgSrc:"b/34.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r34.png",color:'#00ff00'}
            ]
        },
        {
            id:'r4',
            name:'排煙口',
            type:'RE_SmokeOutlet',
            status:[
                {value:'0',imgSrc:"b/21.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r21.png",color:'#00ff00'}
            ]
        },
        {
            id:'r5',
            name:'特別安全梯排煙口進風口',
            type:'SpecialSmokeOutlet',
            status:[
                {value:'0',imgSrc:"b/26.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r26.png",color:'#00ff00'}
            ]
        },
        {
            id:'r6',
            name:'防火閘門',
            type:'RE_SmokeOutlet',
            status:[
                {value:'0',imgSrc:"b/28.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r28.png",color:'#00ff00'}
            ]
        },
        {
            id:'r7',
            name:'連結送水口',
            type:'ConnectWaterOutlet',
            status:[
                {value:'0',imgSrc:"b/30.png",color:'#00a0e9'}
            ]
        },
        {
            id:'r8',
            name:'緊急電源插座',
            type:'RE_EmergencyPowerSocket',
            status:[
                {value:'0',imgSrc:"b/31.png",color:'#00a0e9'}
            ]
        },
        {
            id:'r9',
            name:'無線電通信輔助',
            type:'RE_RadioEquipment',
            status:[
                {value:'0',imgSrc:"b/32.png",color:'#00a0e9'}
            ]
        },
        {
            id:'c1',
            name:'緊急升降機',
            type:'CE_Elevator',
            status:[
                {value:'0',imgSrc:"b/29.png",color:'#00a0e9'}
            ]
        },
        {
            id:'s1',
            name:'避難引導燈具',
            type:'SRE_EscapeGuideLights',
            status:[
                {value:'0',imgSrc:"b/20.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r20.png",color:'#00ff00'}
            ]
        },
        {
            id:'s2',
            name:'緊急照明燈',
            type:'SRE_EmergencyLighting',
            status:[
                {value:'0',imgSrc:"b/20.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r20.png",color:'#ff0000'}
            ]
        },
        {
            id:'o1',
            name:'電燈',
            type:'OE_ElectricLight',
            status:[
                {value:'0',imgSrc:"b/20.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r20.png",color:'#ff0000'}
            ],
            action:[
                {value:'0',label:'關',color:'#00a0e9'},
                {value:'1',label:'開',color:'#ff0000'}
            ]
        },
        {
            id:'o2',
            name:'緊急門鎖',
            type:'OE_EmergencyDoorLock',
            status:[
                {value:'0',imgSrc:"b/20.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r20.png",color:'#ff0000'}
            ]
        },
        {
            id:'o3',
            name:'監視攝影機',
            type:'OE_CCTV',
            status:[
                {value:'0',imgSrc:"b/20.png",color:'#00a0e9'}
            ]
        },
        {
            id:'o4',
            name:'PLC',
            type:'OE_ProgrammableLogicController',
            status:[
                {value:'0',imgSrc:"b/20.png",color:'#00a0e9'}
            ]
        },
        {
            id:'p1',
            name:'緊急電話',
            type:'EmergencyCall',
            status:[
                {value:'0',imgSrc:"b/18.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r18.png",color:'#ff0000'}
            ]
        },
        {
            id:'p2',
            name:'高壓氣體容器儲存場所',
            type:'HighPressurePlace',
            status:[
                {value:'0',imgSrc:"b/12.png",color:'#00a0e9'}
            ]
        },
        {
            id:'p3',
            name:'公共危險物品儲存場所',
            type:'PublicDangerousPlace',
            status:[
                {value:'0',imgSrc:"b/13.png",color:'#00a0e9'}
            ]
        },
        {
            id:'p4',
            name:'空調',
            type:'CE_AirConditioning',
            status:[
                {value:'0',imgSrc:"b/18.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r18.png",color:'#ff0000'}
            ]
        },
        {
            id:'p5',
            name:'消防專用蓄水池',
            type:'RE_FireReservoir',
            status:[
                {value:'0',imgSrc:"b/18.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r18.png",color:'#ff0000'}
            ]
        },
        {
            id:'p6',
            name:'定位',
            type:'People',
            status:[
                {value:'0',imgSrc:"b/18.png",color:'#00a0e9'},
                {value:'1',imgSrc:"r/r18.png",color:'#ff0000'}
            ]
        }
    ],
    AreaCode:[
        {
            "children": [
                {
                    "value": "100",
                    "label": "中正區"
                },
                {
                    "value": "103",
                    "label": "大同區"
                },
                {
                    "value": "104",
                    "label": "中山區"
                },
                {
                    "value": "105",
                    "label": "松山區"
                },
                {
                    "value": "106",
                    "label": "大安區"
                },
                {
                    "value": "108",
                    "label": "萬華區"
                },
                {
                    "value": "110",
                    "label": "信義區"
                },
                {
                    "value": "111",
                    "label": "士林區"
                },
                {
                    "value": "112",
                    "label": "北投區"
                },
                {
                    "value": "114",
                    "label": "內湖區"
                },
                {
                    "value": "115",
                    "label": "南港區"
                },
                {
                    "value": "116",
                    "label": "文山區"
                }
            ],
            "label": "臺北市",
            "value": "臺北市"
        },
        {
            "children": [
                {
                    "value": "200",
                    "label": "仁愛區"
                },
                {
                    "value": "201",
                    "label": "信義區"
                },
                {
                    "value": "202",
                    "label": "中正區"
                },
                {
                    "value": "203",
                    "label": "中山區"
                },
                {
                    "value": "204",
                    "label": "安樂區"
                },
                {
                    "value": "205",
                    "label": "暖暖區"
                },
                {
                    "value": "206",
                    "label": "七堵區"
                }
            ],
            "label": "基隆市",
            "value": "基隆市"
        },
        {
            "children": [
                {
                    "value": "207",
                    "label": "萬里區"
                },
                {
                    "value": "208",
                    "label": "金山區"
                },
                {
                    "value": "220",
                    "label": "板橋區"
                },
                {
                    "value": "221",
                    "label": "汐止區"
                },
                {
                    "value": "222",
                    "label": "深坑區"
                },
                {
                    "value": "223",
                    "label": "石碇區"
                },
                {
                    "value": "224",
                    "label": "瑞芳區"
                },
                {
                    "value": "226",
                    "label": "平溪區"
                },
                {
                    "value": "227",
                    "label": "雙溪區"
                },
                {
                    "value": "228",
                    "label": "貢寮區"
                },
                {
                    "value": "231",
                    "label": "新店區"
                },
                {
                    "value": "232",
                    "label": "坪林區"
                },
                {
                    "value": "233",
                    "label": "烏來區"
                },
                {
                    "value": "234",
                    "label": "永和區"
                },
                {
                    "value": "235",
                    "label": "中和區"
                },
                {
                    "value": "236",
                    "label": "土城區"
                },
                {
                    "value": "237",
                    "label": "三峽區"
                },
                {
                    "value": "238",
                    "label": "樹林區"
                },
                {
                    "value": "239",
                    "label": "鶯歌區"
                },
                {
                    "value": "241",
                    "label": "三重區"
                },
                {
                    "value": "242",
                    "label": "新莊區"
                },
                {
                    "value": "243",
                    "label": "泰山區"
                },
                {
                    "value": "244",
                    "label": "林口區"
                },
                {
                    "value": "247",
                    "label": "蘆洲區"
                },
                {
                    "value": "248",
                    "label": "五股區"
                },
                {
                    "value": "249",
                    "label": "八里區"
                },
                {
                    "value": "251",
                    "label": "淡水區"
                },
                {
                    "value": "252",
                    "label": "三芝區"
                },
                {
                    "value": "253",
                    "label": "石門區"
                }
            ],
            "label": "新北市",
            "value": "新北市"
        },
        {
            "children": [
                {
                    "value": "209",
                    "label": "南竿鄉"
                },
                {
                    "value": "210",
                    "label": "北竿鄉"
                },
                {
                    "value": "211",
                    "label": "莒光鄉"
                },
                {
                    "value": "212",
                    "label": "東引鄉"
                }
            ],
            "label": "連江縣",
            "value": "連江縣"
        },
        {
            "children": [
                {
                    "value": "260",
                    "label": "宜蘭市"
                },
                {
                    "value": "261",
                    "label": "頭城鎮"
                },
                {
                    "value": "262",
                    "label": "礁溪鄉"
                },
                {
                    "value": "263",
                    "label": "壯圍鄉"
                },
                {
                    "value": "264",
                    "label": "員山鄉"
                },
                {
                    "value": "265",
                    "label": "羅東鎮"
                },
                {
                    "value": "266",
                    "label": "三星鄉"
                },
                {
                    "value": "267",
                    "label": "大同鄉"
                },
                {
                    "value": "268",
                    "label": "五結鄉"
                },
                {
                    "value": "269",
                    "label": "冬山鄉"
                },
                {
                    "value": "270",
                    "label": "蘇澳鎮"
                },
                {
                    "value": "272",
                    "label": "南澳鄉"
                },
                {
                    "value": "290",
                    "label": "釣魚臺"
                }
            ],
            "label": "宜蘭縣",
            "value": "宜蘭縣"
        },
        {
            "children": [
                {
                    "value": "300",
                    "label": "東區"
                },
                {
                    "value": "300",
                    "label": "北區"
                },
                {
                    "value": "300",
                    "label": "香山區"
                }
            ],
            "label": "新竹市",
            "value": "新竹市"
        },
        {
            "children": [
                {
                    "value": "302",
                    "label": "竹北市"
                },
                {
                    "value": "303",
                    "label": "湖口鄉"
                },
                {
                    "value": "304",
                    "label": "新豐鄉"
                },
                {
                    "value": "305",
                    "label": "新埔鎮"
                },
                {
                    "value": "306",
                    "label": "關西鎮"
                },
                {
                    "value": "307",
                    "label": "芎林鄉"
                },
                {
                    "value": "308",
                    "label": "寶山鄉"
                },
                {
                    "value": "310",
                    "label": "竹東鎮"
                },
                {
                    "value": "311",
                    "label": "五峰鄉"
                },
                {
                    "value": "312",
                    "label": "橫山鄉"
                },
                {
                    "value": "313",
                    "label": "尖石鄉"
                },
                {
                    "value": "314",
                    "label": "北埔鄉"
                },
                {
                    "value": "315",
                    "label": "峨眉鄉"
                }
            ],
            "label": "新竹縣",
            "value": "新竹縣"
        },
        {
            "children": [
                {
                    "value": "320",
                    "label": "中壢區"
                },
                {
                    "value": "324",
                    "label": "平鎮區"
                },
                {
                    "value": "325",
                    "label": "龍潭區"
                },
                {
                    "value": "326",
                    "label": "楊梅區"
                },
                {
                    "value": "327",
                    "label": "新屋區"
                },
                {
                    "value": "328",
                    "label": "觀音區"
                },
                {
                    "value": "330",
                    "label": "桃園區"
                },
                {
                    "value": "333",
                    "label": "龜山區"
                },
                {
                    "value": "334",
                    "label": "八德區"
                },
                {
                    "value": "335",
                    "label": "大溪區"
                },
                {
                    "value": "336",
                    "label": "復興區"
                },
                {
                    "value": "337",
                    "label": "大園區"
                },
                {
                    "value": "338",
                    "label": "蘆竹區"
                }
            ],
            "label": "桃園市",
            "value": "桃園市"
        },
        {
            "children": [
                {
                    "value": "350",
                    "label": "竹南鎮"
                },
                {
                    "value": "351",
                    "label": "頭份市"
                },
                {
                    "value": "352",
                    "label": "三灣鄉"
                },
                {
                    "value": "353",
                    "label": "南庄鄉"
                },
                {
                    "value": "354",
                    "label": "獅潭鄉"
                },
                {
                    "value": "356",
                    "label": "後龍鎮"
                },
                {
                    "value": "357",
                    "label": "通霄鎮"
                },
                {
                    "value": "358",
                    "label": "苑裡鎮"
                },
                {
                    "value": "360",
                    "label": "苗栗市"
                },
                {
                    "value": "361",
                    "label": "造橋鄉"
                },
                {
                    "value": "362",
                    "label": "頭屋鄉"
                },
                {
                    "value": "363",
                    "label": "公館鄉"
                },
                {
                    "value": "364",
                    "label": "大湖鄉"
                },
                {
                    "value": "365",
                    "label": "泰安鄉"
                },
                {
                    "value": "366",
                    "label": "銅鑼鄉"
                },
                {
                    "value": "367",
                    "label": "三義鄉"
                },
                {
                    "value": "368",
                    "label": "西湖鄉"
                },
                {
                    "value": "369",
                    "label": "卓蘭鎮"
                }
            ],
            "label": "苗栗縣",
            "value": "苗栗縣"
        },
        {
            "children": [
                {
                    "value": "400",
                    "label": "中區"
                },
                {
                    "value": "401",
                    "label": "東區"
                },
                {
                    "value": "402",
                    "label": "南區"
                },
                {
                    "value": "403",
                    "label": "西區"
                },
                {
                    "value": "404",
                    "label": "北區"
                },
                {
                    "value": "406",
                    "label": "北屯區"
                },
                {
                    "value": "407",
                    "label": "西屯區"
                },
                {
                    "value": "408",
                    "label": "南屯區"
                },
                {
                    "value": "411",
                    "label": "太平區"
                },
                {
                    "value": "412",
                    "label": "大里區"
                },
                {
                    "value": "413",
                    "label": "霧峰區"
                },
                {
                    "value": "414",
                    "label": "烏日區"
                },
                {
                    "value": "420",
                    "label": "豐原區"
                },
                {
                    "value": "421",
                    "label": "后里區"
                },
                {
                    "value": "422",
                    "label": "石岡區"
                },
                {
                    "value": "423",
                    "label": "東勢區"
                },
                {
                    "value": "424",
                    "label": "和平區"
                },
                {
                    "value": "426",
                    "label": "新社區"
                },
                {
                    "value": "427",
                    "label": "潭子區"
                },
                {
                    "value": "428",
                    "label": "大雅區"
                },
                {
                    "value": "429",
                    "label": "神岡區"
                },
                {
                    "value": "432",
                    "label": "大肚區"
                },
                {
                    "value": "433",
                    "label": "沙鹿區"
                },
                {
                    "value": "434",
                    "label": "龍井區"
                },
                {
                    "value": "435",
                    "label": "梧棲區"
                },
                {
                    "value": "436",
                    "label": "清水區"
                },
                {
                    "value": "437",
                    "label": "大甲區"
                },
                {
                    "value": "438",
                    "label": "外埔區"
                },
                {
                    "value": "439",
                    "label": "大安區"
                }
            ],
            "label": "臺中市",
            "value": "臺中市"
        },
        {
            "children": [
                {
                    "value": "500",
                    "label": "彰化市"
                },
                {
                    "value": "502",
                    "label": "芬園鄉"
                },
                {
                    "value": "503",
                    "label": "花壇鄉"
                },
                {
                    "value": "504",
                    "label": "秀水鄉"
                },
                {
                    "value": "505",
                    "label": "鹿港鎮"
                },
                {
                    "value": "506",
                    "label": "福興鄉"
                },
                {
                    "value": "507",
                    "label": "線西鄉"
                },
                {
                    "value": "508",
                    "label": "和美鎮"
                },
                {
                    "value": "509",
                    "label": "伸港鄉"
                },
                {
                    "value": "510",
                    "label": "員林市"
                },
                {
                    "value": "511",
                    "label": "社頭鄉"
                },
                {
                    "value": "512",
                    "label": "永靖鄉"
                },
                {
                    "value": "513",
                    "label": "埔心鄉"
                },
                {
                    "value": "514",
                    "label": "溪湖鎮"
                },
                {
                    "value": "515",
                    "label": "大村鄉"
                },
                {
                    "value": "516",
                    "label": "埔鹽鄉"
                },
                {
                    "value": "520",
                    "label": "田中鎮"
                },
                {
                    "value": "521",
                    "label": "北斗鎮"
                },
                {
                    "value": "522",
                    "label": "田尾鄉"
                },
                {
                    "value": "523",
                    "label": "埤頭鄉"
                },
                {
                    "value": "524",
                    "label": "溪州鄉"
                },
                {
                    "value": "525",
                    "label": "竹塘鄉"
                },
                {
                    "value": "526",
                    "label": "二林鎮"
                },
                {
                    "value": "527",
                    "label": "大城鄉"
                },
                {
                    "value": "528",
                    "label": "芳苑鄉"
                },
                {
                    "value": "530",
                    "label": "二水鄉"
                }
            ],
            "label": "彰化縣",
            "value": "彰化縣"
        },
        {
            "children": [
                {
                    "value": "540",
                    "label": "南投市"
                },
                {
                    "value": "541",
                    "label": "中寮鄉"
                },
                {
                    "value": "542",
                    "label": "草屯鎮"
                },
                {
                    "value": "544",
                    "label": "國姓鄉"
                },
                {
                    "value": "545",
                    "label": "埔里鎮"
                },
                {
                    "value": "546",
                    "label": "仁愛鄉"
                },
                {
                    "value": "551",
                    "label": "名間鄉"
                },
                {
                    "value": "552",
                    "label": "集集鎮"
                },
                {
                    "value": "553",
                    "label": "水里鄉"
                },
                {
                    "value": "555",
                    "label": "魚池鄉"
                },
                {
                    "value": "556",
                    "label": "信義鄉"
                },
                {
                    "value": "557",
                    "label": "竹山鎮"
                },
                {
                    "value": "558",
                    "label": "鹿谷鄉"
                }
            ],
            "label": "南投縣",
            "value": "南投縣"
        },
        {
            "children": [
                {
                    "value": "600",
                    "label": "西區"
                },
                {
                    "value": "600",
                    "label": "東區"
                }
            ],
            "label": "嘉義市",
            "value": "嘉義市"
        },
        {
            "children": [
                {
                    "value": "602",
                    "label": "番路鄉"
                },
                {
                    "value": "603",
                    "label": "梅山鄉"
                },
                {
                    "value": "604",
                    "label": "竹崎鄉"
                },
                {
                    "value": "605",
                    "label": "阿里山鄉"
                },
                {
                    "value": "606",
                    "label": "中埔鄉"
                },
                {
                    "value": "607",
                    "label": "大埔鄉"
                },
                {
                    "value": "608",
                    "label": "水上鄉"
                },
                {
                    "value": "611",
                    "label": "鹿草鄉"
                },
                {
                    "value": "612",
                    "label": "太保市"
                },
                {
                    "value": "613",
                    "label": "朴子市"
                },
                {
                    "value": "614",
                    "label": "東石鄉"
                },
                {
                    "value": "615",
                    "label": "六腳鄉"
                },
                {
                    "value": "616",
                    "label": "新港鄉"
                },
                {
                    "value": "621",
                    "label": "民雄鄉"
                },
                {
                    "value": "622",
                    "label": "大林鎮"
                },
                {
                    "value": "623",
                    "label": "溪口鄉"
                },
                {
                    "value": "624",
                    "label": "義竹鄉"
                },
                {
                    "value": "625",
                    "label": "布袋鎮"
                }
            ],
            "label": "嘉義縣",
            "value": "嘉義縣"
        },
        {
            "children": [
                {
                    "value": "630",
                    "label": "斗南鎮"
                },
                {
                    "value": "631",
                    "label": "大埤鄉"
                },
                {
                    "value": "632",
                    "label": "虎尾鎮"
                },
                {
                    "value": "633",
                    "label": "土庫鎮"
                },
                {
                    "value": "634",
                    "label": "褒忠鄉"
                },
                {
                    "value": "635",
                    "label": "東勢鄉"
                },
                {
                    "value": "636",
                    "label": "臺西鄉"
                },
                {
                    "value": "637",
                    "label": "崙背鄉"
                },
                {
                    "value": "638",
                    "label": "麥寮鄉"
                },
                {
                    "value": "640",
                    "label": "斗六市"
                },
                {
                    "value": "643",
                    "label": "林內鄉"
                },
                {
                    "value": "646",
                    "label": "古坑鄉"
                },
                {
                    "value": "647",
                    "label": "莿桐鄉"
                },
                {
                    "value": "648",
                    "label": "西螺鎮"
                },
                {
                    "value": "649",
                    "label": "二崙鄉"
                },
                {
                    "value": "651",
                    "label": "北港鎮"
                },
                {
                    "value": "652",
                    "label": "水林鄉"
                },
                {
                    "value": "653",
                    "label": "口湖鄉"
                },
                {
                    "value": "654",
                    "label": "四湖鄉"
                },
                {
                    "value": "655",
                    "label": "元長鄉"
                }
            ],
            "label": "雲林縣",
            "value": "雲林縣"
        },
        {
            "children": [
                {
                    "value": "700",
                    "label": "中西區"
                },
                {
                    "value": "701",
                    "label": "東區"
                },
                {
                    "value": "702",
                    "label": "南區"
                },
                {
                    "value": "704",
                    "label": "北區"
                },
                {
                    "value": "708",
                    "label": "安平區"
                },
                {
                    "value": "709",
                    "label": "安南區"
                },
                {
                    "value": "710",
                    "label": "永康區"
                },
                {
                    "value": "711",
                    "label": "歸仁區"
                },
                {
                    "value": "712",
                    "label": "新化區"
                },
                {
                    "value": "713",
                    "label": "左鎮區"
                },
                {
                    "value": "714",
                    "label": "玉井區"
                },
                {
                    "value": "715",
                    "label": "楠西區"
                },
                {
                    "value": "716",
                    "label": "南化區"
                },
                {
                    "value": "717",
                    "label": "仁德區"
                },
                {
                    "value": "718",
                    "label": "關廟區"
                },
                {
                    "value": "719",
                    "label": "龍崎區"
                },
                {
                    "value": "720",
                    "label": "官田區"
                },
                {
                    "value": "721",
                    "label": "麻豆區"
                },
                {
                    "value": "722",
                    "label": "佳里區"
                },
                {
                    "value": "723",
                    "label": "西港區"
                },
                {
                    "value": "724",
                    "label": "七股區"
                },
                {
                    "value": "725",
                    "label": "將軍區"
                },
                {
                    "value": "726",
                    "label": "學甲區"
                },
                {
                    "value": "727",
                    "label": "北門區"
                },
                {
                    "value": "730",
                    "label": "新營區"
                },
                {
                    "value": "731",
                    "label": "後壁區"
                },
                {
                    "value": "732",
                    "label": "白河區"
                },
                {
                    "value": "733",
                    "label": "東山區"
                },
                {
                    "value": "734",
                    "label": "六甲區"
                },
                {
                    "value": "735",
                    "label": "下營區"
                },
                {
                    "value": "736",
                    "label": "柳營區"
                },
                {
                    "value": "737",
                    "label": "鹽水區"
                },
                {
                    "value": "741",
                    "label": "善化區"
                },
                {
                    "value": "742",
                    "label": "大內區"
                },
                {
                    "value": "743",
                    "label": "山上區"
                },
                {
                    "value": "744",
                    "label": "新市區"
                },
                {
                    "value": "745",
                    "label": "安定區"
                }
            ],
            "label": "臺南市",
            "value": "臺南市"
        },
        {
            "children": [
                {
                    "value": "800",
                    "label": "新興區"
                },
                {
                    "value": "801",
                    "label": "前金區"
                },
                {
                    "value": "802",
                    "label": "苓雅區"
                },
                {
                    "value": "803",
                    "label": "鹽埕區"
                },
                {
                    "value": "804",
                    "label": "鼓山區"
                },
                {
                    "value": "805",
                    "label": "旗津區"
                },
                {
                    "value": "806",
                    "label": "前鎮區"
                },
                {
                    "value": "807",
                    "label": "三民區"
                },
                {
                    "value": "811",
                    "label": "楠梓區"
                },
                {
                    "value": "812",
                    "label": "小港區"
                },
                {
                    "value": "813",
                    "label": "左營區"
                },
                {
                    "value": "814",
                    "label": "仁武區"
                },
                {
                    "value": "815",
                    "label": "大社區"
                },
                {
                    "value": "817",
                    "label": "東沙群島"
                },
                {
                    "value": "819",
                    "label": "南沙群島"
                },
                {
                    "value": "820",
                    "label": "岡山區"
                },
                {
                    "value": "821",
                    "label": "路竹區"
                },
                {
                    "value": "822",
                    "label": "阿蓮區"
                },
                {
                    "value": "823",
                    "label": "田寮區"
                },
                {
                    "value": "824",
                    "label": "燕巢區"
                },
                {
                    "value": "825",
                    "label": "橋頭區"
                },
                {
                    "value": "826",
                    "label": "梓官區"
                },
                {
                    "value": "827",
                    "label": "彌陀區"
                },
                {
                    "value": "828",
                    "label": "永安區"
                },
                {
                    "value": "829",
                    "label": "湖內區"
                },
                {
                    "value": "830",
                    "label": "鳳山區"
                },
                {
                    "value": "831",
                    "label": "大寮區"
                },
                {
                    "value": "832",
                    "label": "林園區"
                },
                {
                    "value": "833",
                    "label": "鳥松區"
                },
                {
                    "value": "840",
                    "label": "大樹區"
                },
                {
                    "value": "842",
                    "label": "旗山區"
                },
                {
                    "value": "843",
                    "label": "美濃區"
                },
                {
                    "value": "844",
                    "label": "六龜區"
                },
                {
                    "value": "845",
                    "label": "內門區"
                },
                {
                    "value": "846",
                    "label": "杉林區"
                },
                {
                    "value": "847",
                    "label": "甲仙區"
                },
                {
                    "value": "848",
                    "label": "桃源區"
                },
                {
                    "value": "849",
                    "label": "那瑪夏區"
                },
                {
                    "value": "851",
                    "label": "茂林區"
                },
                {
                    "value": "852",
                    "label": "茄萣區"
                }
            ],
            "label": "高雄市",
            "value": "高雄市"
        },
        {
            "children": [
                {
                    "value": "880",
                    "label": "馬公市"
                },
                {
                    "value": "881",
                    "label": "西嶼鄉"
                },
                {
                    "value": "882",
                    "label": "望安鄉"
                },
                {
                    "value": "883",
                    "label": "七美鄉"
                },
                {
                    "value": "884",
                    "label": "白沙鄉"
                },
                {
                    "value": "885",
                    "label": "湖西鄉"
                }
            ],
            "label": "澎湖縣",
            "value": "澎湖縣"
        },
        {
            "children": [
                {
                    "value": "890",
                    "label": "金沙鎮"
                },
                {
                    "value": "891",
                    "label": "金湖鎮"
                },
                {
                    "value": "892",
                    "label": "金寧鄉"
                },
                {
                    "value": "893",
                    "label": "金城鎮"
                },
                {
                    "value": "894",
                    "label": "烈嶼鄉"
                },
                {
                    "value": "896",
                    "label": "烏坵鄉"
                }
            ],
            "label": "金門縣",
            "value": "金門縣"
        },
        {
            "children": [
                {
                    "value": "900",
                    "label": "屏東市"
                },
                {
                    "value": "901",
                    "label": "三地門鄉"
                },
                {
                    "value": "902",
                    "label": "霧臺鄉"
                },
                {
                    "value": "903",
                    "label": "瑪家鄉"
                },
                {
                    "value": "904",
                    "label": "九如鄉"
                },
                {
                    "value": "905",
                    "label": "里港鄉"
                },
                {
                    "value": "906",
                    "label": "高樹鄉"
                },
                {
                    "value": "907",
                    "label": "鹽埔鄉"
                },
                {
                    "value": "908",
                    "label": "長治鄉"
                },
                {
                    "value": "909",
                    "label": "麟洛鄉"
                },
                {
                    "value": "911",
                    "label": "竹田鄉"
                },
                {
                    "value": "912",
                    "label": "內埔鄉"
                },
                {
                    "value": "913",
                    "label": "萬丹鄉"
                },
                {
                    "value": "920",
                    "label": "潮州鎮"
                },
                {
                    "value": "921",
                    "label": "泰武鄉"
                },
                {
                    "value": "922",
                    "label": "來義鄉"
                },
                {
                    "value": "923",
                    "label": "萬巒鄉"
                },
                {
                    "value": "924",
                    "label": "崁頂鄉"
                },
                {
                    "value": "925",
                    "label": "新埤鄉"
                },
                {
                    "value": "926",
                    "label": "南州鄉"
                },
                {
                    "value": "927",
                    "label": "林邊鄉"
                },
                {
                    "value": "928",
                    "label": "東港鎮"
                },
                {
                    "value": "929",
                    "label": "琉球鄉"
                },
                {
                    "value": "931",
                    "label": "佳冬鄉"
                },
                {
                    "value": "932",
                    "label": "新園鄉"
                },
                {
                    "value": "940",
                    "label": "枋寮鄉"
                },
                {
                    "value": "941",
                    "label": "枋山鄉"
                },
                {
                    "value": "942",
                    "label": "春日鄉"
                },
                {
                    "value": "943",
                    "label": "獅子鄉"
                },
                {
                    "value": "944",
                    "label": "車城鄉"
                },
                {
                    "value": "945",
                    "label": "牡丹鄉"
                },
                {
                    "value": "946",
                    "label": "恆春鎮"
                },
                {
                    "value": "947",
                    "label": "滿州鄉"
                }
            ],
            "label": "屏東縣",
            "value": "屏東縣"
        },
        {
            "children": [
                {
                    "value": "950",
                    "label": "臺東市"
                },
                {
                    "value": "951",
                    "label": "綠島鄉"
                },
                {
                    "value": "952",
                    "label": "蘭嶼鄉"
                },
                {
                    "value": "953",
                    "label": "延平鄉"
                },
                {
                    "value": "954",
                    "label": "卑南鄉"
                },
                {
                    "value": "955",
                    "label": "鹿野鄉"
                },
                {
                    "value": "956",
                    "label": "關山鎮"
                },
                {
                    "value": "957",
                    "label": "海端鄉"
                },
                {
                    "value": "958",
                    "label": "池上鄉"
                },
                {
                    "value": "959",
                    "label": "東河鄉"
                },
                {
                    "value": "961",
                    "label": "成功鎮"
                },
                {
                    "value": "962",
                    "label": "長濱鄉"
                },
                {
                    "value": "963",
                    "label": "太麻里鄉"
                },
                {
                    "value": "964",
                    "label": "金峰鄉"
                },
                {
                    "value": "965",
                    "label": "大武鄉"
                },
                {
                    "value": "966",
                    "label": "達仁鄉"
                }
            ],
            "label": "臺東縣",
            "value": "臺東縣"
        },
        {
            "children": [
                {
                    "value": "970",
                    "label": "花蓮市"
                },
                {
                    "value": "971",
                    "label": "新城鄉"
                },
                {
                    "value": "972",
                    "label": "秀林鄉"
                },
                {
                    "value": "973",
                    "label": "吉安鄉"
                },
                {
                    "value": "974",
                    "label": "壽豐鄉"
                },
                {
                    "value": "975",
                    "label": "鳳林鎮"
                },
                {
                    "value": "976",
                    "label": "光復鄉"
                },
                {
                    "value": "977",
                    "label": "豐濱鄉"
                },
                {
                    "value": "978",
                    "label": "瑞穗鄉"
                },
                {
                    "value": "979",
                    "label": "萬榮鄉"
                },
                {
                    "value": "981",
                    "label": "玉里鎮"
                },
                {
                    "value": "982",
                    "label": "卓溪鄉"
                },
                {
                    "value": "983",
                    "label": "富里鄉"
                }
            ],
            "label": "花蓮縣",
            "value": "花蓮縣"
        }
    ],
    ProcessMenu:
    {
        left:
        [
            {
                type:'upper-step',
                name:'上一步',
                icon:'el-icon-refresh-left'
            },
            {
                type:'next-step',
                name:'下一步',
                icon:'el-icon-refresh-right'
            },
            {
                type:'delete',
                name:'刪除',
                icon:'el-icon-delete'
            }
        ],
        right:
        [
            {
                type:'import',
                name:'載入檔案',
                icon:'el-icon-upload'
            },
            {
                type:'export',
                name:'下載檔案',
                icon:'el-icon-download'
            },
            {
                type:'view-code',
                name:'查看json數據',
                icon:'el-icon-more'
            },
            {
                type:'save',
                name:'儲存數據',
                icon:'el-icon-files'
            },
            {
                type:'clear',
                name:'清空',
                icon:'el-icon-document-delete'
            },
        ]
    },
    GraphicMenuView:
    {
        left:
        [
            // {
            //     type:'',
            //     name:'移動',
            //     icon:'el-icon-thumb'
            // },
            // {
            //     type:'icon',
            //     name:'圖例',
            //     icon:'el-icon-add-location'
            // }
        ],
        right:
        [
            {
                type:'',
                name:'移動',
                icon:'el-icon-rank'
            },
            {
                type:'resetlocation',
                name:'復原位置',
                icon:'el-icon-map-location'
            },
            {
                type:'export',
                name:'下載json檔案',
                icon:'el-icon-download'
            },
            {
                type:'view-code',
                name:'查看json數據',
                icon:'el-icon-more'
            },
            {
                type:'saveImage',
                name:'儲存圖片',
                icon:'el-icon-picture-outline'
            }
        ]
    },
    GraphicMenuEdit:
    {
        left:
        [
            // {
            //     type:'icon',
            //     name:'圖例',
            //     icon:'el-icon-add-location'
            // },
            {
                type:'text',
                name:'文字',
                icon:'el-icon-edit'
            },
            {
                type:'rectangle',
                name:'四邊形',
                icon:'el-icon-full-screen'
            },
            {
                type:'polygon',
                name:'多邊形',
                icon:'el-icon-house'
            },
            {
                type:'upper-step',
                name:'上一步',
                icon:'el-icon-refresh-left'
            },
            {
                type:'next-step',
                name:'下一步',
                icon:'el-icon-refresh-right'
            },
            {
                type:'delete',
                name:'刪除',
                icon:'el-icon-delete'
            }
        ],
        right:
        [
            {
                type:'',
                name:'移動',
                icon:'el-icon-rank'
            },
            {
                type:'resetlocation',
                name:'復原位置',
                icon:'el-icon-map-location'
            },
            {
                type:'export',
                name:'下載json檔案',
                icon:'el-icon-download'
            },
            {
                type:'view-code',
                name:'查看json數據',
                icon:'el-icon-more'
            },
            {
                type:'save',
                name:'儲存數據',
                icon:'el-icon-files'
            },
            {
                type:'saveImage',
                name:'儲存圖片',
                icon:'el-icon-picture-outline'
            },
            {
                type:'clear',
                name:'清空',
                icon:'el-icon-document-delete'
            }
        ]
    }
}
