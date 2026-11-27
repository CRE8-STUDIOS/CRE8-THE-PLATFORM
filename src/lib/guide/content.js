/**
 * Content for the CRE8 guide.
 * Numbers in curly braces, like {kor_turnover_limit}, are filled in from the tax_rules table
 * for the current year, so the texts stay correct when the rules change.
 * Every lesson is a short chat with the assistant: it says one or more lines (bot),
 * then the user taps an answer (options). An option with feedback is a wrong quiz answer:
 * the feedback is shown and the user stays on the same step.
 */

export const moneyLessons = [
	{
		slug: 'business-types',
		title: 'Eenmanszaak or bv?',
		summary: 'What kind of business you are, and what the difference is',
		minutes: 4,
		steps: [
			{
				bot: [
					"Before anything else: what kind of business are you? In the Netherlands most freelancers start as an eenmanszaak. Some have a bv. Let's look at both."
				],
				options: [{ label: "Let's go", next: 1 }]
			},
			{
				bot: [
					'An eenmanszaak is you. You and your business are the same person in the eyes of the law.',
					'You register it yourself at the KVK, no notary needed. It costs {kvk_registration_fee} euro, once.',
					'You pay income tax over your profit, and you can get deductions like the zelfstandigenaftrek.'
				],
				options: [{ label: 'And the catch?', next: 2 }]
			},
			{
				bot: [
					'If your business has debts, you pay them with your own money too. Your savings, your stuff. That is called personal liability.',
					'For most creatives that risk is small, because you mostly sell your time and ideas, not big loans or stock.'
				],
				options: [{ label: 'Okay. And a bv?', next: 3 }]
			},
			{
				bot: [
					'A bv is a separate company. It has its own money, and its debts stay in the bv. Your private money is protected.',
					'You start a bv through a notary, which costs more. The bv pays company tax: {vpb_rate_low}% over profit up to {vpb_bracket} euro.',
					'You become an employee of your own bv and must pay yourself a salary of at least {gebruikelijk_loon} euro a year.',
					'And you do not get the freelancer deductions like the zelfstandigenaftrek.'
				],
				options: [{ label: 'So which one is for me?', next: 4 }]
			},
			{
				bot: [
					'Starting out and earning less than that salary? Then an eenmanszaak is almost always the simple choice.',
					'Earning a lot, or taking big risks? Then a bv can be worth it. You can always switch later. An accountant can help you decide.'
				],
				options: [{ label: 'Got it', next: 5 }]
			},
			{
				bot: ['Quick check. Which one can you register yourself at the KVK, without a notary?'],
				options: [
					{ label: 'Eenmanszaak', next: 6 },
					{
						label: 'Bv',
						next: 5,
						feedback:
							'Not quite. A bv always goes through a notary. The eenmanszaak you do yourself. Try again.'
					}
				]
			},
			{
				bot: ['Exactly. Now tell me: what are you right now? Then I adjust CRE8 to you.'],
				options: [
					{ label: 'Eenmanszaak', next: 7, action: { setBusinessType: 'eenmanszaak' } },
					{ label: 'Bv', next: 7, action: { setBusinessType: 'bv' } },
					{ label: 'Not registered yet', next: 7, action: { setBusinessType: 'not_registered' } },
					{
						label: 'Business outside the Netherlands',
						next: 7,
						action: { setBusinessType: 'abroad' }
					}
				]
			},
			{
				bot: [
					'Saved. If you have a bv, CRE8 still helps with btw and invoices. Tax help for bvs comes in a later version.'
				],
				options: []
			}
		],
		done: {
			title: 'You know what you are.',
			line: 'Eenmanszaak is simple and yours. A bv is a separate company. You can switch later.',
			cta: { label: 'Next: register at the KVK', href: '/guide/money/register-kvk' }
		}
	},
	{
		slug: 'register-kvk',
		title: 'Register at the KVK',
		summary: 'How you officially start',
		minutes: 4,
		steps: [
			{
				bot: [
					'Starting for real? Then you register your business in the KVK Handelsregister. Everyone with a business does this.'
				],
				options: [{ label: 'How does it work?', next: 1 }]
			},
			{
				bot: [
					'You start online on kvk.nl and log in with DigiD. You fill in your business name, address and what you do.',
					'Then you make an appointment at a KVK office to finish it. It costs {kvk_registration_fee} euro, once.'
				],
				options: [{ label: 'And then?', next: 2 }]
			},
			{
				bot: [
					'You get your KVK number right away. The KVK passes your details to the Belastingdienst, so you do not have to register there separately.',
					'A few weeks later you get a letter with your btw number and btw id. Keep that letter.'
				],
				options: [{ label: 'What is the difference between those two?', next: 3 }]
			},
			{
				bot: [
					'Your btw id goes on your invoices and website. Your btw number is only for you and the Belastingdienst, when you do your btw aangifte.',
					'The registration fee is a business cost, so you can deduct it.'
				],
				options: [{ label: 'Nice', next: 4 }]
			},
			{
				bot: ['Quick check. Do you also need to register at the Belastingdienst yourself?'],
				options: [
					{
						label: 'Yes',
						next: 4,
						feedback: 'No need. The KVK passes your details on automatically. Try again.'
					},
					{ label: 'No, KVK does that', next: 5 }
				]
			},
			{
				bot: [
					'Right. Put your KVK number and btw id in CRE8, then they are on every invoice automatically.'
				],
				options: []
			}
		],
		done: {
			title: 'Officially a business.',
			line: 'Register online, finish at a KVK office, get your numbers.',
			cta: { label: 'Add my KVK number and btw id', href: '/settings' }
		}
	},
	{
		slug: 'what-is-btw',
		title: 'What is btw?',
		summary: 'Why it is never your money',
		minutes: 3,
		steps: [
			{
				bot: ["Let's talk about btw. It sounds scary, it really is not."],
				options: [
					{ label: 'Ready', next: 1 },
					{ label: 'What is btw even?', next: 1 }
				]
			},
			{
				bot: [
					'Btw is a tax on what you sell. You add it on top of your price, the client pays it to you, and you pass it on to the Belastingdienst.',
					'So it was never your money. You only hold it for a while.'
				],
				options: [{ label: 'Got it', next: 2 }]
			},
			{
				bot: [
					'Most creative work has {btw_rate_standard}% btw. Quick check: your price is 500 euro. What does your client pay?'
				],
				options: [
					{
						label: '500 euro',
						next: 2,
						feedback: 'Almost. The btw comes on top: 500 plus 105 is 605. Try again.'
					},
					{ label: '605 euro', next: 3 },
					{
						label: '395 euro',
						next: 2,
						feedback:
							'Not quite. You add the btw, you do not take it off. 500 plus 105 is 605. Try again.'
					}
				]
			},
			{
				bot: [
					'Exactly. 500 is yours, 105 goes to the Belastingdienst.',
					'The good part: btw you pay on business costs, like a new laptop, you get back. CRE8 adds it all up for you.'
				],
				options: [{ label: 'Nice', next: 4 }]
			},
			{
				bot: [
					'One more thing. If you earn less than {kor_turnover_limit} euro a year, you can choose to charge no btw at all. That is the KOR, the next lesson.'
				],
				options: []
			}
		],
		done: {
			title: 'Btw? Easy.',
			line: 'You add it on top, you keep it apart, you pass it on.',
			cta: { label: 'Set up btw in CRE8', href: '/settings' }
		}
	},
	{
		slug: 'kor',
		title: 'KOR: yes or no?',
		summary: 'No btw when you earn less',
		minutes: 3,
		steps: [
			{
				bot: ['The KOR is the kleineondernemersregeling. It is a choice, not a must.'],
				options: [{ label: 'Tell me', next: 1 }]
			},
			{
				bot: [
					'If your turnover is {kor_turnover_limit} euro a year or less, you can sign up for the KOR.',
					'Then you charge no btw to clients, and you do not do btw aangifte. Much less admin.'
				],
				options: [{ label: 'Sounds perfect', next: 2 }]
			},
			{
				bot: [
					'There is a downside. You also cannot get back the btw on your costs.',
					'Buying expensive gear this year? Then the KOR can cost you money. Mostly selling your time, few costs? Then it is often handy.'
				],
				options: [{ label: 'And if I earn more later?', next: 3 }]
			},
			{
				bot: [
					'The moment you go over the limit, the KOR stops and you charge btw again from that invoice on. CRE8 warns you when you get close.'
				],
				options: [{ label: 'Good to know', next: 4 }]
			},
			{
				bot: ['Quick check. With the KOR, can you get back the btw on a new camera?'],
				options: [
					{
						label: 'Yes',
						next: 4,
						feedback: 'No. With the KOR you charge no btw and you get none back. Try again.'
					},
					{ label: 'No', next: 5 }
				]
			},
			{
				bot: [
					'Right. You sign up for the KOR at the Belastingdienst. Tell CRE8 if you use it, then your invoices show no btw.'
				],
				options: []
			}
		],
		done: {
			title: 'KOR, sorted.',
			line: 'Less admin, but no btw back on costs. Your choice.',
			cta: { label: 'Tell CRE8 if I use the KOR', href: '/settings' }
		}
	},
	{
		slug: 'first-invoice',
		title: 'Your first invoice',
		summary: 'Everything that must be on it',
		minutes: 4,
		steps: [
			{
				bot: [
					'Time to get paid. An invoice, a factuur, has a few things that must be on it by law.'
				],
				options: [{ label: 'Show me', next: 1 }]
			},
			{
				bot: [
					'Your name and address, your KVK number and your btw id.',
					'The name and address of your client.',
					'The date, and an invoice number that follows the last one, with no gaps.'
				],
				options: [{ label: 'More?', next: 2 }]
			},
			{
				bot: [
					'What you did, and when.',
					'The price without btw, the btw rate, the btw amount, and the total.',
					'With the KOR you leave the btw out and mention that you use the KOR.'
				],
				options: [{ label: 'And when do they pay?', next: 3 }]
			},
			{
				bot: [
					'You choose a payment term, most freelancers use 14 or 30 days. Put it on the invoice. CRE8 sends a friendly reminder when it is late.'
				],
				options: [{ label: 'Nice', next: 4 }]
			},
			{
				bot: [
					'Quick check. Can you skip an invoice number, for example go from 2026-004 to 2026-010?'
				],
				options: [
					{
						label: 'Sure',
						next: 4,
						feedback:
							'Better not. Numbers must follow each other with no gaps. CRE8 does this for you. Try again.'
					},
					{ label: 'No, they follow each other', next: 5 }
				]
			},
			{
				bot: ['Exactly. In CRE8 all of this is filled in for you. You only add what you did.'],
				options: []
			}
		],
		done: {
			title: 'Ready to get paid.',
			line: 'Your details, theirs, the work, the btw and a number that follows.',
			cta: { label: 'Make my first invoice', href: '/finance' }
		}
	},
	{
		slug: 'business-account',
		title: 'A separate bank account',
		summary: 'Keep business and private apart',
		minutes: 2,
		steps: [
			{
				bot: [
					'With an eenmanszaak a business account is not required. But it makes your life so much easier.'
				],
				options: [{ label: 'Why?', next: 1 }]
			},
			{
				bot: [
					'All business money in one place, all private money in another. Your admin stays clean, and you see what your business really earns.',
					'Many freelancers also use a second savings account just for tax money. More about that in the next lesson.'
				],
				options: [{ label: 'Makes sense', next: 2 }]
			},
			{
				bot: ['Quick check. Is a business account required for an eenmanszaak?'],
				options: [
					{ label: 'Yes', next: 2, feedback: 'Not required, but very handy. Try again.' },
					{ label: 'No, but it helps a lot', next: 3 }
				]
			},
			{
				bot: ['Right. Put the IBAN in CRE8, then it is on your invoices.'],
				options: []
			}
		],
		done: {
			title: 'Clean money.',
			line: 'Business in, business out. Private stays private.',
			cta: { label: 'Add my IBAN', href: '/settings' }
		}
	},
	{
		slug: 'money-aside',
		title: 'Put money aside',
		summary: 'For btw and income tax',
		minutes: 3,
		steps: [
			{
				bot: [
					"The biggest money mistake of starting freelancers: spending money that was never yours. Let's prevent that."
				],
				options: [{ label: 'Yes please', next: 1 }]
			},
			{
				bot: [
					'First: all btw you receive goes aside, every euro. You pay it back every quarter.',
					'Second: part of your profit is for income tax, which you pay later. How much depends on what you earn.'
				],
				options: [{ label: 'How do I know how much?', next: 2 }]
			},
			{
				bot: [
					'CRE8 calculates it from your invoices and costs, and shows how much to move to your tax savings account each month. Not exact, but close enough to never be surprised.'
				],
				options: [{ label: 'Nice', next: 3 }]
			},
			{
				bot: [
					'Quick check. You got 1,210 euro including 210 euro btw. How much of the btw goes aside?'
				],
				options: [
					{ label: 'Half', next: 3, feedback: 'All of it. Btw is never yours. Try again.' },
					{ label: 'All 210 euro', next: 4 }
				]
			},
			{
				bot: [
					'Right. And from the 1,000 that is left, CRE8 tells you how much to keep for income tax.'
				],
				options: []
			}
		],
		done: {
			title: 'No tax surprises.',
			line: 'Btw aside, every time. A part of your profit too.',
			cta: { label: 'See how much to set aside', href: '/finance' }
		}
	},
	{
		slug: 'btw-aangifte',
		title: 'Btw aangifte every quarter',
		summary: 'When and how, also with zero',
		minutes: 4,
		steps: [
			{
				bot: [
					'Every quarter you tell the Belastingdienst how much btw you charged and paid. That is the btw aangifte.'
				],
				options: [{ label: 'When exactly?', next: 1 }]
			},
			{
				bot: [
					'Usually per quarter, and it is due at the end of the month after the quarter. So for January to March, by 30 April.',
					'You do it online in Mijn Belastingdienst Zakelijk.'
				],
				options: [{ label: 'What do I fill in?', next: 2 }]
			},
			{
				bot: [
					'How much you invoiced and the btw on it. Then the btw you paid on costs. The difference you pay, or get back.',
					'CRE8 shows the numbers per box, ready to copy. You file it yourself.'
				],
				options: [{ label: 'And if I earned nothing?', next: 3 }]
			},
			{
				bot: [
					'Then you still file it, with zero. Forgetting it can mean a fine. CRE8 reminds you two weeks before.'
				],
				options: [{ label: 'Good', next: 4 }]
			},
			{
				bot: ['Quick check. No invoices this quarter. Do you skip the aangifte?'],
				options: [
					{ label: 'Yes', next: 4, feedback: 'No, you still file it, with zero. Try again.' },
					{ label: 'No, I file a zero', next: 5 }
				]
			},
			{
				bot: ['Exactly. With the KOR you do not file btw aangifte at all.'],
				options: []
			}
		],
		done: {
			title: 'Quarterly, no stress.',
			line: 'CRE8 shows the numbers, you copy them, done.',
			cta: { label: 'See my next btw aangifte', href: '/finance/tax' }
		}
	},
	{
		slug: 'count-hours',
		title: 'Count your hours',
		summary: 'The {hours_criterion} hours and why they matter',
		minutes: 3,
		steps: [
			{
				bot: [
					'If you work at least {hours_criterion} hours a year on your business, you can get extra tax deductions. That is the urencriterium.'
				],
				options: [{ label: 'That is a lot of hours', next: 1 }]
			},
			{
				bot: [
					'It is about 24 hours a week. And it is not only client work.',
					'Admin, finding clients, your website, learning new skills: it all counts.'
				],
				options: [{ label: 'How do I prove it?', next: 2 }]
			},
			{
				bot: [
					'By keeping track. That is what the clock in in CRE8 is for. Every hour you clock, in any category, counts toward the {hours_criterion}.'
				],
				options: [{ label: 'Nice', next: 3 }]
			},
			{
				bot: ['Quick check. Do hours spent on your invoices count?'],
				options: [
					{
						label: 'No, only client work',
						next: 3,
						feedback: 'They do count. Admin is business time too. Try again.'
					},
					{ label: 'Yes, admin counts', next: 4 }
				]
			},
			{
				bot: ['Right. Keep clocking in, and CRE8 tells you if you are on track for the year.'],
				options: []
			}
		],
		done: {
			title: 'Every hour counts.',
			line: '{hours_criterion} hours a year, client work and admin together.',
			cta: { label: 'See my hours this year', href: '/time' }
		}
	},
	{
		slug: 'income-tax',
		title: 'Income tax once a year',
		summary: 'And the deductions you may get',
		minutes: 5,
		steps: [
			{
				bot: [
					'Once a year you do your income tax return, the inkomstenbelasting. Usually before 1 May, over the year before.'
				],
				options: [{ label: 'Over what exactly?', next: 1 }]
			},
			{
				bot: [
					'Over your profit: everything you earned, minus your business costs.',
					'Then you can take a few amounts off before the tax is calculated. Those are the deductions.'
				],
				options: [{ label: 'Which deductions?', next: 2 }]
			},
			{
				bot: [
					'If you meet the {hours_criterion} hours: the zelfstandigenaftrek, {zelfstandigenaftrek} euro.',
					'In your first years you may also get the startersaftrek, {startersaftrek} euro. The government plans to end it, so check every year.'
				],
				options: [{ label: 'And the rest?', next: 3 }]
			},
			{
				bot: [
					'There are more rules, but you do not need to know them all. CRE8 makes a yearly overview with your profit and the deductions you probably get. Many freelancers let an accountant file it with that overview.'
				],
				options: [{ label: 'Good', next: 4 }]
			},
			{
				bot: ['Quick check. Do you pay income tax over everything you invoiced?'],
				options: [
					{
						label: 'Yes',
						next: 4,
						feedback: 'No, over your profit. That is what you earned minus your costs. Try again.'
					},
					{ label: 'No, over my profit', next: 5 }
				]
			},
			{
				bot: ['Exactly. Keep your costs in CRE8, and your profit is always right.'],
				options: []
			}
		],
		done: {
			title: 'Once a year, prepared.',
			line: 'Profit minus deductions. CRE8 has the overview ready.',
			cta: { label: 'See my yearly overview', href: '/finance/overview' }
		}
	},
	{
		slug: 'keep-records',
		title: 'Keep everything {bewaarplicht_years} years',
		summary: 'What to save and where',
		minutes: 2,
		steps: [
			{
				bot: [
					'Last one. You must keep your business records for {bewaarplicht_years} years. That is the bewaarplicht.'
				],
				options: [{ label: 'What counts as records?', next: 1 }]
			},
			{
				bot: [
					'Every invoice you sent, every receipt and invoice you got, your bank statements, and contracts.',
					'Digital is fine, as long as you can show them.'
				],
				options: [{ label: 'Where do I keep them?', next: 2 }]
			},
			{
				bot: [
					'In CRE8. Invoices and contracts are saved automatically. Upload receipts with a photo. Leaving CRE8 one day? You can download everything first.'
				],
				options: [{ label: 'Nice', next: 3 }]
			},
			{
				bot: ["Quick check. Can you throw away last year's receipts once your tax return is done?"],
				options: [
					{
						label: 'Yes',
						next: 3,
						feedback: 'No, keep them {bewaarplicht_years} years. Try again.'
					},
					{ label: 'No, {bewaarplicht_years} years', next: 4 }
				]
			},
			{
				bot: [
					'That is all ten. You now know more about freelance money than most people who start. I am proud of you.'
				],
				options: []
			}
		],
		done: {
			title: 'You did all of them.',
			line: 'Business type, KVK, btw, KOR, invoices, a separate account, money aside, aangifte, hours, income tax and records.',
			cta: { label: 'Back to the guide', href: '/guide' }
		}
	}
]

export const appTour = [
	{
		slug: 'morning',
		title: 'Your morning',
		page: '/overview',
		steps: [
			{
				target: 'greeting',
				text: 'Every morning I say hi and ask if you want me to walk you through your day.'
			},
			{
				target: 'planning',
				text: 'Say yes and you get your day in a few sentences: meetings, tasks, deadlines and errands.'
			},
			{
				target: 'clock-in',
				text: 'On the Overview I ask if you want to clock in, and on which project. You can always say later.'
			}
		]
	},
	{
		slug: 'agenda',
		title: 'Agenda',
		page: '/agenda',
		steps: [
			{
				target: 'day',
				text: 'This is your day. Every block has a time, a title and what kind of thing it is.'
			},
			{
				target: 'focus',
				text: 'A thick line is protected focus time. Clients cannot book a meeting over it.'
			},
			{
				target: 'assistant-bar',
				text: 'Up here I tell you the one thing that matters most, like when you need a break.'
			},
			{
				target: 'add',
				text: 'Use ADD to put something in your agenda. You first choose what it is, then answer a few short questions.'
			}
		]
	},
	{
		slug: 'tasks',
		title: 'Tasks',
		page: '/agenda/tasks',
		steps: [
			{
				target: 'columns',
				text: 'Today, tomorrow and this week. Tasks without a date wait apart and do not count in your day.'
			},
			{
				target: 'priority',
				text: 'The word on the right is how important it is. MUST means it has to happen that day.'
			},
			{
				target: 'quick-add',
				text: 'Add a task right here: type it, tap how important and how long, press Enter.'
			}
		]
	},
	{
		slug: 'projects',
		title: 'Projects',
		page: '/projects',
		steps: [
			{
				target: 'list',
				text: 'Every client job is a project. Open one and everything is there: the brief, price, contract, invoices and moodboard.'
			},
			{
				target: 'board',
				text: 'The project board shows what is to do, in progress, in review and done.'
			},
			{
				target: 'review',
				text: 'Move a card to In review and your client sees it in their portal, to approve or ask for changes.'
			}
		]
	},
	{
		slug: 'contracts',
		title: 'Contracts and Add Request',
		page: '/projects',
		steps: [
			{
				target: 'contract',
				text: 'Make a contract from a template. Your client signs it online in their portal.'
			},
			{
				target: 'add-request',
				text: 'Client wants something extra? Add it as a request with a price. Only after they approve it, it is added to the contract and the invoice.'
			},
			{ target: 'fit', text: 'And I check if and when it fits in your agenda before the deadline.' }
		]
	},
	{
		slug: 'hours',
		title: 'Hours',
		page: '/time',
		steps: [
			{
				target: 'clock',
				text: 'Clock in when you start, clock out when you stop. Pick the project or the kind of work.'
			},
			{
				target: 'week',
				text: 'Here you see your hours per week and per project, and if you are working too much.'
			},
			{
				target: 'criterion',
				text: 'And here how far you are with the {hours_criterion} hours for this year.'
			}
		]
	},
	{
		slug: 'finance',
		title: 'Finance',
		page: '/finance',
		steps: [
			{
				target: 'invoices',
				text: 'Make and send invoices. Numbers, btw and your details are filled in for you.'
			},
			{
				target: 'costs',
				text: 'Upload receipts and incoming invoices. The btw on them counts for your aangifte.'
			},
			{
				target: 'tax',
				text: 'Your btw numbers per quarter and how much to set aside for income tax. Guidance, you file it yourself.'
			}
		]
	},
	{
		slug: 'workspace',
		title: 'Workspace',
		page: '/workspace',
		steps: [
			{ target: 'tools', text: 'Your creative tools: moodboards, notes and the whiteboard.' },
			{
				target: 'apps',
				text: 'Put the apps you use every day here, with your own icon. One click and you are there.'
			},
			{
				target: 'links',
				text: 'And the links you keep looking for, like the Belastingdienst or your price list.'
			}
		]
	}
]
