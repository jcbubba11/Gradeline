/* One Stop interview prep: question bank and company guides.
   Questions are common, publicly discussed interview patterns. Company notes summarize what each
   employer publishes about its own hiring (values, stages) plus widely reported question themes.
   Nothing here is copied or scraped from review sites. Kept in its own file so it can grow
   without touching index.html. */

/* Each field: id, label, fit (rp-field values it matches), groups of [question, tip].
   kind "star" = behavioral, answered in Situation/Task/Action/Result boxes.
   kind "notes" = technical or knowledge question, answered in one notes box. */
const IP_FIELDS = [
{ id: "openers", label: "Openers & motivation", any: true, groups: [
  { name: "Getting started", kind: "notes", qs: [
    ["Tell me about yourself.", "60 to 90 seconds: where you are now, one or two results you're proud of, and why this role is the next step. Don't recite your resume."],
    ["Walk me through your resume.", "Go in order, but spend time only on what connects to this job. Give the reason behind each move."],
    ["Why do you want this job?", "Name something specific about the role, then connect it to what you're good at and what you want to learn."],
    ["Why do you want to work here?", "Mention a product, project, value or person you talked to. 'Great culture' alone sounds like you didn't research them."],
    ["Why this industry?", "Tell the moment or experience that pulled you in, then what you've done since to explore it."],
    ["Why are you interested in this internship?", "Show what you want to learn and what you'll contribute. Interns who are curious and reliable get return offers."],
    ["What do you know about our company?", "Cover what they sell, who their customers are, one recent piece of news, and how the team you'd join fits in."],
    ["How did you hear about this role?", "If someone referred you or you met the team at a career fair, say so by name."],
    ["Why did you choose your major?", "Give the real reason, and connect a skill from the major to this job."],
    ["What makes you a good fit for this role?", "Pick the top two or three requirements from the posting and give proof for each."],
    ["Why should we hire you over other candidates?", "Don't compare yourself to others. Summarize your strongest match plus one thing that's unusual about you."],
    ["Where do you see yourself in five years?", "Show ambition that fits the path this company offers. It's fine to say you're still exploring, as long as you name a direction."],
    ["What are your greatest strengths?", "Pick two that the job needs, and back each with a short example."],
    ["What is your biggest weakness?", "Name a real one that isn't core to the job, then what you're doing about it. Avoid 'I work too hard'."],
    ["How would your friends or classmates describe you?", "Three words, each with a quick example. Pick words that fit the job."],
    ["What are you most proud of?", "Choose something with a clear result, and say what it took from you."],
    ["What motivates you?", "Be specific: solving hard problems, helping people, seeing numbers move. Tie it to the work in this role."],
    ["What kind of work environment do you do your best work in?", "Be honest but flexible. Research how the team works first."],
    ["What are you looking for in your next role?", "Learning, responsibility, the kind of team. Make sure the answer matches this job."],
    ["What other companies are you interviewing with?", "You can say you're exploring similar roles in the industry without naming names. It shows you're focused."],
    ["Why are you leaving your current job?", "Stay positive: you're looking for growth, a better fit, or a new challenge. Never criticize a past employer."],
    ["Can you explain this gap in your resume?", "Short and honest: what you did during it (caregiving, health, school, a job search), and that you're ready now."],
    ["What are your salary expectations?", "If you can, ask for their range first. Otherwise give a researched range, not one number."],
    ["When can you start?", "Give a real date. For internships, mention any exam or semester dates that matter."],
    ["Is there anything else you'd like us to know?", "Use it. Add one strong point you didn't get to, then thank them."]
  ]}
]},
{ id: "behavioral", label: "Behavioral (STAR)", any: true, groups: [
  { name: "Teamwork", kind: "star", qs: [
    ["Tell me about a time you worked on a team to reach a goal.", "Make your own role clear. Say 'I' for what you did and 'we' for what the team did."],
    ["Describe a time a team member wasn't pulling their weight. What did you do?", "Show that you talked to them directly and kindly before going to a manager or professor."],
    ["Tell me about a group project that didn't go well.", "Own your part, explain what you changed, and end with what you'd do differently."],
    ["Give an example of how you helped a teammate succeed.", "Interviewers want to hear that you lift others up, not just finish your own work."],
    ["Tell me about a time you worked with people very different from you.", "Different majors, backgrounds or working styles. Show how the differences made the result better."],
    ["Describe a time you had to rely on others to finish your work.", "Show how you set expectations and followed up without micromanaging."],
    ["Tell me about a time you took on a role on a team that wasn't your usual one.", "Shows flexibility. Explain why you stepped in and what you learned."],
    ["Tell me about a time you built a relationship with someone who was hard to get to know.", "Show patience and genuine interest in the other person."]
  ]},
  { name: "Leadership", kind: "star", qs: [
    ["Tell me about a time you led a group.", "A formal title isn't needed. Leading a project, a shift or a club event counts."],
    ["Describe a time you had to get people to follow your lead without formal authority.", "Show how you earned buy-in: listening, sharing the why, and doing the work yourself."],
    ["Tell me about a time you motivated others.", "What did you learn about what each person cared about?"],
    ["Give an example of a tough decision you made as a leader.", "Lay out the options you weighed and why you chose one. Admit the tradeoff."],
    ["Tell me about a time you delegated work.", "How did you decide who did what, and how did you check in?"],
    ["Describe a time you had to give someone critical feedback.", "Show you were specific, private and respectful, and that you followed up."],
    ["Tell me about a time you started something new: a club, a project, a process.", "Interviewers love initiative. Include how it's still running or what it led to."],
    ["Tell me about a time you had to lead through change or uncertainty.", "How did you keep people informed and focused?"]
  ]},
  { name: "Conflict", kind: "star", qs: [
    ["Tell me about a time you disagreed with a coworker or classmate.", "Show you listened first, focused on the goal, and found a solution. Don't make the other person the villain."],
    ["Describe a time you disagreed with your boss or a professor.", "Show respect, explain how you raised it with evidence, and accept the outcome either way."],
    ["Tell me about a time you had to work with someone you didn't get along with.", "Keep it professional. Focus on how you made the work succeed anyway."],
    ["Give an example of a time you had to persuade someone who disagreed with you.", "Data, a test, or understanding their concern usually wins. Show which one you used."],
    ["Tell me about a time you resolved a conflict between other people.", "Show that you stayed neutral and got both sides talking about the goal."],
    ["Describe a time you had to say no to someone.", "Explain how you said no and what alternative you offered."]
  ]},
  { name: "Failure & feedback", kind: "star", qs: [
    ["Tell me about a time you failed.", "Pick a real failure. Spend a short time on what happened and most of the answer on what you learned and changed."],
    ["Tell me about a mistake you made and how you handled it.", "Own it quickly, explain how you fixed it, and how you prevent it now."],
    ["Describe a time you received critical feedback. How did you respond?", "Show you didn't get defensive, and give a concrete change you made."],
    ["Tell me about a time you missed a deadline.", "Explain what you did as soon as you saw you'd miss it. Telling people early is the key."],
    ["Tell me about a goal you didn't reach.", "What would you do differently? Did you hit it later?"],
    ["Describe a time you took a risk. How did it turn out?", "Risks that didn't work are fine if you explain why they were worth trying."],
    ["Tell me about a time you had to admit you were wrong.", "Shows humility. Explain what changed your mind."]
  ]},
  { name: "Problem-solving", kind: "star", qs: [
    ["Tell me about a difficult problem you solved.", "Walk through how you broke the problem down, not only the final answer."],
    ["Describe a time you used data to make a decision.", "Name the data, what it showed, and what you decided because of it."],
    ["Tell me about a time data changed your mind about something.", "Shows you're open-minded. Describe what you believed before and after."],
    ["Give an example of a time you improved a process.", "Give a before-and-after number if you can: time saved, errors cut, money saved."],
    ["Tell me about a time you had to solve a problem with limited information.", "What assumptions did you make, and how did you check them?"],
    ["Describe a creative solution you came up with.", "What did others try first, and why was your idea different?"],
    ["Tell me about a time you found a problem before anyone else noticed.", "Shows attention to detail and ownership."],
    ["Tell me about the hardest technical or academic problem you've worked on.", "Go deep. They'll ask follow-up questions to see how well you understand it."]
  ]},
  { name: "Time & pressure", kind: "star", qs: [
    ["Tell me about a time you had several deadlines at once. How did you prioritize?", "Name your method: ranking by deadline and impact, asking for clarity, or blocking time."],
    ["Describe a time you worked under a lot of pressure.", "Show how you stayed calm and what you focused on first."],
    ["Tell me about a time you had to balance school, work and other commitments.", "Great for students. Include how you kept your grades or quality up."],
    ["Give an example of a time you had to make a quick decision.", "What did you know, what didn't you know, and how did it turn out?"],
    ["Tell me about a time you had to finish something with very little time.", "What did you cut, and what did you refuse to cut?"],
    ["Describe how you stay organized on a busy week.", "Tools and habits are fine here: calendars, lists, checking in with your team."]
  ]},
  { name: "Adaptability", kind: "star", qs: [
    ["Tell me about a time plans changed at the last minute.", "Show you adjusted quickly and kept the goal in sight."],
    ["Describe a time you had to learn something new quickly.", "Explain how you learned it, and how quickly you were using it."],
    ["Tell me about a time you stepped outside your comfort zone.", "What did it teach you about yourself?"],
    ["Give an example of a time you adapted to a new team or environment.", "A new job, school, country or team all work."],
    ["Tell me about a time you had to work with unclear instructions.", "Show you asked good questions and moved forward anyway."]
  ]},
  { name: "Initiative & drive", kind: "star", qs: [
    ["Tell me about a time you went above and beyond.", "Make sure the extra effort had a result someone noticed."],
    ["Describe a goal you set for yourself and how you reached it.", "Specific goal, specific plan, specific result."],
    ["Tell me about a time you beat a goal. What did you do differently?", "Explain the choice that made the difference."],
    ["Give an example of something you did without being asked.", "Shows ownership. Explain why you noticed the need."],
    ["Tell me about a time you were persistent despite setbacks.", "Show how many times you tried and what kept you going."],
    ["Tell me about something you taught yourself.", "A skill, tool, language or hobby. Shows curiosity."]
  ]},
  { name: "Communication", kind: "star", qs: [
    ["Tell me about a time you explained something complicated to someone without your background.", "Show how you checked they understood, not only how you explained."],
    ["Describe a presentation you gave. How did you prepare?", "Include how the audience reacted or what happened next."],
    ["Tell me about a time you had to deliver bad news.", "Show you were honest, timely and came with a plan."],
    ["Give an example of a time good listening made a difference.", "What did you hear that others missed?"],
    ["Tell me about a time you had to write something important.", "A report, proposal or email that changed a decision."],
    ["Describe a time there was a misunderstanding. How did you fix it?", "Show how you cleared it up and what you do now to avoid it."]
  ]},
  { name: "Customers & service", kind: "star", qs: [
    ["Tell me about a difficult customer and how you handled them.", "Show empathy first, then the fix. End with how the customer felt."],
    ["Describe a time you went out of your way for a customer or client.", "Specific details make this believable."],
    ["Tell me about a time you couldn't give a customer what they wanted.", "What did you offer instead?"],
    ["Give an example of how you found out what a customer really needed.", "Questions you asked, and what you learned."]
  ]},
  { name: "Ethics & integrity", kind: "star", qs: [
    ["Tell me about a time you faced an ethical dilemma.", "Show your reasoning and that you chose the right thing even when it was harder."],
    ["Describe a time you saw something you thought was wrong at work or school.", "How did you raise it, and with whom?"],
    ["Tell me about a time you had to keep information confidential.", "Shows trustworthiness, which matters in finance, healthcare and government."],
    ["Tell me about a time you were tempted to cut corners. What did you do?", "Honesty about the temptation makes the answer stronger."]
  ]}
]},
{ id: "students", label: "Students & new grads", any: true, groups: [
  { name: "School and experience", kind: "notes", qs: [
    ["What was your favorite class, and why?", "Pick one that connects to the job if you can, and say what you did with what you learned."],
    ["What class did you find hardest?", "Show how you worked through it: office hours, study groups, changing how you studied."],
    ["Why is your GPA what it is?", "If it's lower, own it briefly, show the upward trend or strong major GPA, and point to other proof of ability."],
    ["Tell me about a project you did in school that you're proud of.", "Treat it like a job: your role, the problem, what you built, the result."],
    ["What did you learn from your last internship or part-time job?", "Name one skill and one thing about yourself."],
    ["How do your extracurriculars prepare you for this role?", "Translate them: treasurer means budgeting, club president means leading a team."],
    ["What would you do on your first day here?", "Listen, meet the team, learn the tools, ask what success looks like."],
    ["What would you want to accomplish by the end of this internship?", "Something concrete: finish a project, learn a skill, earn a return offer."],
    ["Are you open to relocating?", "Be honest. If you have a preferred location, say so but stay flexible."],
    ["What are you reading or learning outside of class?", "Have one real answer ready that shows curiosity about the field."],
    ["What would your professors say about you?", "Pick one professor and one specific trait."],
    ["Tell me about a time you balanced a job with school.", "Hours worked plus how you kept up shows serious time management."]
  ]}
]},
{ id: "situational", label: "Situational & curveballs", any: true, groups: [
  { name: "What would you do if...", kind: "notes", qs: [
    ["What would you do if you were given a task you'd never done before?", "Research, ask a teammate, try a first version, check in early."],
    ["What would you do if your manager gave you two urgent tasks at once?", "Ask which matters more, and say what you'd tell the other person."],
    ["What would you do if you noticed a coworker making a serious mistake?", "Talk to them privately first unless safety or ethics require going higher right away."],
    ["What would you do if you disagreed with a decision your team made?", "Raise it once with reasons, then commit to the decision."],
    ["What would you do if you realized you couldn't meet a deadline?", "Tell people as early as possible and come with options."],
    ["What would you do if a customer was yelling at you?", "Stay calm, listen, apologize for the experience, and focus on what you can fix."],
    ["What would you do if you finished your work early?", "Ask for more, help teammates, or improve something you noticed."],
    ["How would you handle a teammate taking credit for your work?", "Talk to them first. Keep records of your work so your contribution is visible."]
  ]},
  { name: "Curveballs", kind: "notes", qs: [
    ["If you could have dinner with anyone, who would it be and why?", "There's no right answer. They want to see how you think and what you value."],
    ["What's something you believe that most people disagree with?", "Pick something thoughtful but not controversial or political."],
    ["Teach me something in five minutes.", "Pick something simple you know well. Check that they're following."],
    ["Sell me this pen.", "Ask questions about what they need first, then sell the benefit, not the features."],
    ["How many gas stations are there in the United States?", "Estimation question. Say your assumptions out loud and do simple math. The method matters more than the number."],
    ["What would you do with a million dollars?", "Shows your values and how you plan."],
    ["What's the last book you read or podcast you listened to?", "Have a real answer and one thing you took from it."],
    ["If you were an animal, which would you be?", "Pick one and connect a trait to how you work. Keep it short and light."],
    ["What would your perfect day at work look like?", "Make sure it sounds like this job."],
    ["What's a hobby you have, and what has it taught you?", "Hobbies make you memorable. Connect one lesson to work."]
  ]}
]},
{ id: "ask", label: "Questions to ask them", any: true, groups: [
  { name: "Ask at the end", kind: "notes", qs: [
    ["What does success look like in this role after 90 days?", "Shows you're thinking about delivering, not only getting hired."],
    ["What are the team's biggest goals this year?", "Lets you connect your skills to their priorities in your thank-you note."],
    ["What does a typical day or week look like?", "Good for spotting whether the job matches the posting."],
    ["What do you enjoy most about working here?", "Interviewers like talking about themselves, and you learn about the culture."],
    ["What's one challenge the team is facing right now?", "If you can, briefly say how you'd help."],
    ["How do interns or new hires get feedback?", "Shows you want to grow."],
    ["What have past interns done that made them stand out?", "Tells you exactly how to earn a return offer."],
    ["How is the team structured, and who would I work with most?", "Helps you understand reporting lines and collaborators."],
    ["What training or mentorship do new hires get?", "Important for entry-level roles."],
    ["How has this role changed over the past year?", "Shows whether the team is growing or changing direction."],
    ["What are the next steps in the process?", "Always ask, so you know when to follow up."],
    ["Is there anything about my background that makes you hesitate?", "Bold but useful. Gives you a chance to answer a concern before you leave."],
    ["What do you wish you'd known before you started here?", "Often gets the most honest answer."],
    ["How does this team work with other parts of the company?", "Shows you think about the bigger picture."],
    ["What's the company's plan for the next few years, and how does this team fit?", "Good for larger companies and final rounds."]
  ]}
]},
{ id: "ib", label: "Investment banking & markets", fit: ["accounting"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Why investment banking?", "Talk about the learning, the deals, the pace, and the people you've met. Avoid leading with money."],
    ["Why sales and trading instead of banking (or the other way)?", "Show you understand the difference: markets and quick decisions versus long deal work."],
    ["Walk me through a deal you've followed recently.", "Who bought whom, the price, the reason, and whether you think it was a good idea."],
    ["Tell me about a time you worked long hours to finish something.", "They want proof you can handle the workload without losing quality."],
    ["Tell me about a time you caught a mistake in someone's work.", "Attention to detail is critical in banking."]
  ]},
  { name: "Accounting basics", kind: "notes", qs: [
    ["Walk me through the three financial statements.", "Income statement (revenue to net income), balance sheet (assets = liabilities + equity), cash flow statement (operating, investing, financing). Then how they connect."],
    ["How are the three statements linked?", "Net income flows to the top of the cash flow statement and to retained earnings. Ending cash on the cash flow statement becomes cash on the balance sheet."],
    ["If depreciation goes up by $10, what happens to the three statements?", "Assume a 25% tax rate: net income falls $7.50, cash rises $2.50 (from lower taxes), PP&E falls $10, retained earnings fall $7.50. It balances."],
    ["What's the difference between cash and accrual accounting?", "Accrual records revenue when earned and expenses when incurred, not when cash moves."],
    ["What is working capital?", "Current assets minus current liabilities. Bankers often mean operating working capital, which excludes cash and debt."],
    ["Why is the cash flow statement important?", "Profit can look good while cash runs out. Cash pays the bills."],
    ["What is EBITDA, and why do people use it?", "Earnings before interest, taxes, depreciation and amortization. A rough proxy for operating cash flow that's easier to compare across companies."],
    ["What is goodwill, and how is it created?", "The amount paid above the fair value of a company's net assets in an acquisition."]
  ]},
  { name: "Valuation", kind: "notes", qs: [
    ["What are the main ways to value a company?", "Comparable companies, precedent transactions, and DCF. Mention LBO analysis for a floor price."],
    ["Walk me through a DCF.", "Project unlevered free cash flow, find a terminal value, discount both back at WACC, add them for enterprise value, then bridge to equity value."],
    ["What's the difference between enterprise value and equity value?", "Equity value is what shareholders own. Enterprise value is the whole business: equity value plus debt and preferred stock, minus cash."],
    ["How do you calculate WACC?", "Cost of equity times equity weight plus after-tax cost of debt times debt weight."],
    ["How do you find the cost of equity?", "CAPM: risk-free rate plus beta times the equity risk premium."],
    ["Which valuation method usually gives the highest value?", "Often precedent transactions, because buyers pay a control premium. It depends on the market."],
    ["What are common valuation multiples?", "EV/EBITDA, EV/Revenue, P/E. Use EV multiples with metrics available to all investors (like EBITDA) and equity multiples with metrics after interest (like net income)."],
    ["Why would you use a terminal multiple instead of a perpetuity growth rate?", "Multiples tie to the market. Growth rates rely on a long-term assumption. Good answers cross-check both."],
    ["What is free cash flow?", "Cash from operations minus capital expenditures. Unlevered free cash flow is before interest payments."]
  ]},
  { name: "Deals, LBOs and markets", kind: "notes", qs: [
    ["Walk me through a basic LBO.", "A buyer uses a lot of debt to buy a company, uses its cash flow to pay down debt, and sells it in about five years. Returns come from growth, debt paydown and multiple changes."],
    ["What makes a good LBO candidate?", "Steady cash flows, low capex needs, a strong market position, and room to cut costs."],
    ["Is an acquisition accretive or dilutive?", "Compare the buyer's earnings per share before and after. All-stock deals are accretive if the buyer's P/E is higher than the target's."],
    ["Why would a company issue debt instead of equity?", "Debt is cheaper and interest is tax-deductible, but it adds risk. Equity doesn't need to be repaid but dilutes owners."],
    ["Where do you think the market is going?", "Have a view with two or three reasons. Mention interest rates, inflation, earnings and one recent headline."],
    ["Pitch me a stock.", "What the company does, why it's mispriced, two or three reasons, a target price or catalyst, and the main risk."],
    ["What happens to bond prices when interest rates rise?", "They fall. Longer bonds fall more."],
    ["What's a recent IPO or merger you found interesting?", "Name it, the price, the reason, and your opinion."],
    ["What is the yield curve, and what does an inverted one mean?", "Yields across maturities. Inverted means short-term rates are higher than long-term, which has often come before recessions."],
    ["What's the Fed funds rate right now, and why does it matter?", "Check it the morning of your interview. It affects borrowing costs, valuations and deal activity."]
  ]}
]},
{ id: "accounting", label: "Accounting, audit & tax", fit: ["accounting"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Why accounting?", "Connect a real experience (a class, a job, a family business) to why you like the work."],
    ["Why audit (or tax, or advisory)?", "Show you know what each group does day to day."],
    ["Why a Big 4 firm, and why ours?", "Training, client variety, the people you met at recruiting events. Name someone you talked to."],
    ["Are you planning to sit for the CPA exam? What's your plan?", "Have a timeline. Mention 150-hour credit planning if it applies."],
    ["Tell me about a time you worked with a lot of detail and accuracy mattered.", "Show your process for checking your work."],
    ["Tell me about a time you handled confidential information.", "Client confidentiality is core to the profession."],
    ["Describe how you'd handle a client who won't give you the documents you need.", "Polite follow-up, explain why you need them, set deadlines, escalate to your senior if needed."],
    ["How do you handle busy season hours?", "Show you understand the schedule and have a plan to stay sharp."]
  ]},
  { name: "Technical", kind: "notes", qs: [
    ["What's the difference between GAAP and IFRS?", "U.S. GAAP is more rules-based, IFRS more principles-based. IFRS doesn't allow LIFO."],
    ["What are debits and credits?", "Debits increase assets and expenses, credits increase liabilities, equity and revenue. Every entry balances."],
    ["Walk me through the accounting cycle.", "Analyze transactions, journalize, post to the ledger, trial balance, adjusting entries, financial statements, closing entries."],
    ["What is revenue recognition?", "Under ASC 606, recognize revenue when you satisfy a performance obligation, in the amount you expect to receive. Know the five steps."],
    ["What is materiality?", "Whether an error is big enough to change a reader's decision. Auditors set a materiality threshold for each engagement."],
    ["What's the difference between an audit and a review?", "An audit gives reasonable assurance with detailed testing. A review gives limited assurance mostly from inquiry and analytics."],
    ["What are internal controls, and why do they matter?", "Processes that prevent or catch errors and fraud. Sarbanes-Oxley requires public companies to test them."],
    ["What's the difference between a deferred tax asset and a deferred tax liability?", "They come from timing differences between book and tax accounting."],
    ["What is a journal entry for prepaying rent?", "Debit prepaid rent, credit cash. Then each month debit rent expense and credit prepaid rent."],
    ["What's the difference between LIFO and FIFO?", "Which inventory costs go to cost of goods sold first. In rising prices, LIFO gives higher COGS and lower taxes."],
    ["What is the difference between a tax credit and a deduction?", "A credit reduces tax owed dollar for dollar. A deduction reduces taxable income."],
    ["How would you explain an audit to someone outside accounting?", "An independent check that a company's financial statements are fair and accurate, so investors can trust them."],
    ["What Excel skills do you have?", "Name specific ones: VLOOKUP or XLOOKUP, pivot tables, SUMIFS, data validation."]
  ]}
]},
{ id: "corpfin", label: "Banking, finance & FP&A", fit: ["accounting"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Why corporate finance (or commercial banking, or wealth management)?", "Show you know how the role differs from investment banking or accounting."],
    ["Tell me about a time you built a budget or tracked money.", "A club treasurer role or personal budget counts."],
    ["Tell me about a time you explained numbers to someone who isn't a finance person.", "FP&A and banking roles spend a lot of time translating numbers into decisions."],
    ["Tell me about a time you built a relationship with a client or customer.", "Core to commercial banking and wealth management."],
    ["Describe a time you found an error in a spreadsheet or report.", "How you found it and what you did."]
  ]},
  { name: "Technical", kind: "notes", qs: [
    ["What is a variance analysis?", "Comparing actual results to budget or forecast and explaining why they differ."],
    ["How would you build a revenue forecast?", "Volume times price, broken down by product or region, with assumptions you can explain."],
    ["What do you look at to decide whether to lend to a business?", "The five C's of credit: character, capacity, capital, collateral, conditions."],
    ["What is a debt service coverage ratio?", "Cash available for debt payments divided by those payments. Above 1.25x is a common comfort level."],
    ["What's the difference between gross margin and operating margin?", "Gross margin is after cost of goods. Operating margin is after operating expenses too."],
    ["How do interest rates affect a bank's profits?", "Through net interest margin: what the bank earns on loans minus what it pays on deposits."],
    ["What is the time value of money?", "A dollar today is worth more than a dollar later because it can earn a return."],
    ["What's NPV, and how do you use it?", "Net present value of future cash flows minus the cost. Positive NPV means the project adds value."],
    ["How would you explain diversification to a client?", "Spreading money across investments so one bad result doesn't hurt you too much."],
    ["What financial news have you been following?", "Have one story and an opinion on it."]
  ]}
]},
{ id: "consulting", label: "Consulting", fit: ["accounting", "general"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Why consulting?", "Variety of problems, fast learning, working with clients. Show you understand the travel and the hours."],
    ["Why our firm?", "Name people you met, practice areas you like, and something specific about how they work."],
    ["Tell me about a time you had a big impact on a group or organization.", "Common in consulting fit interviews. Pick a story with a clear before and after."],
    ["Tell me about a time you led a team through a hard situation.", "Consulting firms test leadership in almost every round."],
    ["Describe a time you had to win over someone who was skeptical of you.", "Clients often start skeptical of young consultants."],
    ["Tell me about a time you worked with incomplete data and still made a recommendation.", "Show your reasoning and how you flagged your assumptions."],
    ["What's an industry you find interesting, and why?", "Have a short opinion on trends and challenges."]
  ]},
  { name: "Case practice prompts", kind: "notes", qs: [
    ["A coffee chain's profits have dropped 20% over two years. Why, and what should they do?", "Profit = revenue minus costs. Split revenue into price and volume, costs into fixed and variable, then dig into the biggest change."],
    ["A retailer wants to enter a new country. Should it?", "Market size and growth, competitors, the company's ability to win, costs to enter, and a clear yes or no."],
    ["Estimate the market size for electric scooters in Chicago.", "Population, share who'd use them, trips per year, price per trip. Say assumptions out loud and round numbers."],
    ["A hospital's emergency room wait times are too long. How would you fix it?", "Map the patient flow, find the bottleneck, and suggest fixes for that step."],
    ["A private equity firm is thinking of buying a gym chain. What would you look at?", "Market, company performance, how to grow it, risks, and the price."],
    ["Should a car maker launch a subscription service?", "Customer demand, economics per customer, competitors, impact on current sales."],
    ["A software company wants to raise prices. What should it consider?", "Customer value, competitor prices, how many customers might leave, and how to test it."],
    ["How many tennis balls fit in a school bus?", "Volume of the bus divided by volume of a ball, with a packing adjustment."],
    ["A nonprofit wants to double its donations in three years. How?", "More donors, bigger gifts, keeping donors longer. Find the biggest lever."],
    ["An airline's on-time rate is falling. What's going on?", "Break it into causes: weather, maintenance, crew, airport congestion, scheduling."],
    ["Revenue is $50M, costs are $42M, and costs are growing 8% a year while revenue grows 3%. When do they lose money?", "Practice mental math. Roughly year four, but show the steps."],
    ["What questions would you ask to start any case?", "Clarify the goal, the timeline, and what success means to the client."]
  ]}
]},
{ id: "swe", label: "Software engineering", fit: ["tech"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Tell me about a project you built. What was hardest?", "Go deep on one technical decision and why you made it."],
    ["Tell me about a bug that took you a long time to find.", "Walk through how you narrowed it down."],
    ["Describe a time you disagreed with a teammate about a technical decision.", "Show you used data or a quick test to decide, not who was louder."],
    ["Tell me about a time you had to learn a new language or framework fast.", "How you learned and what you built with it."],
    ["Tell me about a time you got feedback in a code review.", "Show you're open to it and what you changed."],
    ["Tell me about something you'd build differently if you started over.", "Shows you reflect and keep learning."],
    ["What's a piece of technology you're excited about, and why?", "Have an opinion and know its limits."]
  ]},
  { name: "Coding and concepts", kind: "notes", qs: [
    ["Reverse a linked list.", "Classic. Practice iterative (three pointers) and recursive versions."],
    ["Find two numbers in an array that add up to a target.", "Use a hash map for O(n) time. Explain the brute force first, then improve it."],
    ["Check whether a string has balanced parentheses.", "Use a stack."],
    ["Find the first non-repeating character in a string.", "Count with a hash map, then scan again."],
    ["Merge two sorted arrays or lists.", "Two pointers."],
    ["Detect a cycle in a linked list.", "Fast and slow pointers."],
    ["Find the maximum depth of a binary tree.", "Recursion or breadth-first search."],
    ["Given a grid of land and water, count the islands.", "Depth-first or breadth-first search marking visited cells."],
    ["Find the longest substring without repeating characters.", "Sliding window with a set or map."],
    ["What's the time complexity of your solution? Can you improve it?", "Always state Big O for time and space before they ask."],
    ["Explain the difference between an array and a linked list.", "Arrays give fast index access, linked lists give fast insert and delete."],
    ["When would you use a hash map versus a tree?", "Hash maps are faster on average, trees keep keys sorted."],
    ["Explain how a hash table works.", "Hash function, buckets, and how collisions are handled."],
    ["What is recursion, and when can it cause problems?", "A function that calls itself. Deep recursion can overflow the stack."],
    ["Explain object-oriented programming.", "Encapsulation, inheritance, polymorphism, abstraction, with a quick example."],
    ["What's the difference between a process and a thread?", "Processes have separate memory. Threads share memory inside a process."],
    ["What happens when you type a URL into a browser and press Enter?", "DNS lookup, TCP and TLS connection, HTTP request, server response, rendering. Go as deep as they want."],
    ["What's the difference between SQL and NoSQL databases?", "Structured tables with joins versus flexible documents or key-value stores. Tradeoffs in consistency and scaling."],
    ["Explain REST APIs.", "Resources at URLs, HTTP methods like GET and POST, and stateless requests."],
    ["How would you design a URL shortener?", "Common system design starter: generating short codes, storing mappings, handling lots of reads, caching."],
    ["How do you test your code?", "Unit tests, integration tests, and edge cases. Mention a testing framework you've used."],
    ["What does Git rebase do compared with merge?", "Rebase rewrites your commits on top of another branch. Merge keeps both histories with a merge commit."]
  ]}
]},
{ id: "data", label: "Data science & analytics", fit: ["tech"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Tell me about a data project you're proud of.", "The question, the data, your method, and the decision it led to."],
    ["Tell me about a time your analysis was wrong or misleading.", "How you found out and what you changed in your process."],
    ["Describe a time you presented data to a non-technical audience.", "What chart or message did you choose, and why?"],
    ["Tell me about a time you had to clean messy data.", "Specific problems you found and how you fixed them."]
  ]},
  { name: "Technical", kind: "notes", qs: [
    ["Write a SQL query to find the top 5 customers by total spending.", "GROUP BY customer, SUM the amount, ORDER BY descending, LIMIT 5."],
    ["What's the difference between INNER JOIN and LEFT JOIN?", "Inner keeps only matches. Left keeps every row from the left table."],
    ["What is a window function? Give an example.", "Calculations across related rows without collapsing them, like ROW_NUMBER() or a running total."],
    ["How would you find duplicate rows in a table?", "GROUP BY the key columns HAVING COUNT(*) > 1."],
    ["Explain p-values to a non-technical person.", "How surprising your result would be if there were really no effect."],
    ["How would you design an A/B test for a new checkout button?", "Pick one success metric, randomize users, calculate sample size, run long enough, check significance."],
    ["What's the difference between correlation and causation?", "Two things moving together doesn't mean one causes the other. Give an example."],
    ["What is overfitting, and how do you prevent it?", "A model that memorizes training data. Use more data, simpler models, cross-validation, regularization."],
    ["Explain the bias-variance tradeoff.", "Simple models miss patterns (bias), complex models chase noise (variance)."],
    ["How do you handle missing data?", "Understand why it's missing first, then drop, fill in, or flag it."],
    ["What metrics would you track for a food delivery app?", "Orders, delivery time, repeat customers, cancellations. Explain which matters most and why."],
    ["Daily active users dropped 10% yesterday. How would you investigate?", "Check data errors first, then split by platform, region, user type and recent releases."],
    ["What's the difference between precision and recall?", "Precision: of what you flagged, how much was right. Recall: of what was there, how much you caught."],
    ["Which tools do you use: Python, R, Excel, Tableau, Power BI?", "Name what you've actually used and a project for each."]
  ]}
]},
{ id: "pm", label: "Product management", fit: ["tech"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Why product management?", "Connect a story where you figured out what users needed and got a team to build it."],
    ["Tell me about a time you had to prioritize between competing requests.", "Show a framework: impact, effort, and the goal."],
    ["Tell me about a time you made a decision without full data.", "What you assumed and how you checked later."],
    ["Describe a time you influenced engineers or designers without authority.", "Core to the role."]
  ]},
  { name: "Product sense", kind: "notes", qs: [
    ["What's your favorite product, and how would you improve it?", "Who uses it, what problem it solves, one specific improvement, how you'd measure it."],
    ["Design an app for college students to find study partners.", "Pick a user, list their problems, prioritize one, sketch the solution, define success."],
    ["How would you measure the success of a new feature?", "One main metric tied to the goal, plus guardrail metrics so you don't hurt something else."],
    ["Usage of a key feature dropped 15%. What do you do?", "Rule out data bugs, then segment by user, platform and time to find the cause."],
    ["Should we build this feature or that one?", "Compare user impact, business impact, effort and strategy."],
    ["How would you explain a technical tradeoff to an executive?", "Lead with the business impact and your recommendation."],
    ["Tell me about a product that failed, and why.", "Show you can analyze what went wrong."],
    ["How would you get more people to use our product?", "Find where users drop off and fix the biggest leak first."]
  ]}
]},
{ id: "it", label: "IT, cybersecurity & support", fit: ["tech"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Tell me about a time you fixed a technical problem for someone frustrated.", "Patience and clear explanations matter as much as the fix."],
    ["Describe a time you had to learn a system quickly.", "How you learned and how fast you were productive."],
    ["Tell me about a time you followed a procedure carefully under pressure.", "Shows reliability, which security and support roles depend on."]
  ]},
  { name: "Technical", kind: "notes", qs: [
    ["A user says their computer can't connect to the internet. What do you check?", "Physical connection or Wi-Fi, IP address, DNS, other devices on the network. Work from simple to complex."],
    ["What's the difference between TCP and UDP?", "TCP is reliable and ordered, UDP is faster with no guarantee of delivery."],
    ["What is DNS?", "Translates domain names into IP addresses."],
    ["What is the CIA triad?", "Confidentiality, integrity, availability: the three goals of security."],
    ["How would you spot a phishing email?", "Mismatched sender, urgency, odd links, requests for credentials or payment."],
    ["What's the difference between encryption and hashing?", "Encryption can be reversed with a key, hashing is one-way."],
    ["What is multi-factor authentication, and why does it matter?", "Something you know plus something you have or are. It stops most password attacks."],
    ["What would you do if you suspected a computer had malware?", "Disconnect it from the network, report it, follow the incident response plan."],
    ["What is Active Directory?", "Microsoft's directory service for managing users, computers and permissions."],
    ["What certifications do you have or plan to get?", "CompTIA A+, Network+, Security+ are common starting points."],
    ["How do you stay current on security threats?", "Name real sources you read or follow."]
  ]}
]},
{ id: "marketing", label: "Marketing & communications", fit: ["creative"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Tell me about a campaign or project you ran. What were the results?", "Give numbers: reach, engagement, sign-ups, sales."],
    ["Tell me about a time a campaign didn't work.", "What the data told you and what you changed."],
    ["Describe a time you wrote something under a tight deadline.", "Show how you kept quality up."],
    ["Tell me about a time you used customer feedback to change something.", "Shows you listen to the audience."],
    ["Tell me about a time you worked with a designer, sales team or client.", "Marketing is cross-team work."]
  ]},
  { name: "Knowledge", kind: "notes", qs: [
    ["What's a brand whose marketing you admire, and why?", "Pick a recent example and explain who it targets and why it works."],
    ["How would you market our product to college students?", "Pick channels they use, a message that fits, and how you'd measure it."],
    ["Which metrics matter most for a social media campaign?", "Depends on the goal: awareness (reach), engagement (comments, shares), conversion (clicks, sales)."],
    ["What's the difference between SEO and paid search?", "SEO earns free traffic over time, paid search buys clicks right away."],
    ["How would you measure the return on a marketing campaign?", "Revenue or leads it drove compared with what it cost. Mention attribution."],
    ["What social media trends are you following?", "Have one or two with examples."],
    ["Walk me through how you'd launch a new product.", "Audience, message, channels, timeline, budget, metrics."],
    ["How do you define our target customer?", "Research them first. Name demographics plus needs and habits."],
    ["What tools have you used: Canva, Adobe, HubSpot, Google Analytics, Meta Ads?", "Give a real example with each."],
    ["Critique our website or social media.", "Start with what works, then one or two specific, kind improvements."]
  ]}
]},
{ id: "sales", label: "Sales & business development", fit: ["general", "creative"], groups: [
  { name: "Fit questions", kind: "star", qs: [
    ["Tell me about a time you convinced someone to buy, join or say yes.", "Show how you found out what they needed first."],
    ["Tell me about a time you handled rejection.", "Sales is full of no's. Show resilience and what you learned."],
    ["Describe a time you hit or beat a target.", "Give the target, your number, and how you did it."],
    ["Tell me about a time you built a relationship that paid off later.", "Shows long-term thinking."],
    ["Tell me about a time you lost a deal or customer. What happened?", "Own it and say what you'd change."]
  ]},
  { name: "Role-play and knowledge", kind: "notes", qs: [
    ["Sell me this pen.", "Ask about their needs first, then sell the benefit that matters to them, then ask for the sale."],
    ["How would you handle a customer who says our price is too high?", "Ask what they're comparing it to, then focus on value and results."],
    ["How do you research a prospect before a call?", "LinkedIn, the company website, recent news, mutual connections."],
    ["Walk me through how you'd plan your week of cold calls or emails.", "Time blocks, a target number, follow-up rules, tracking in a CRM."],
    ["What makes a good salesperson?", "Listening, persistence, honesty, organization."],
    ["What's your experience with a CRM like Salesforce or HubSpot?", "If none, say how you track contacts now and that you learn tools quickly."],
    ["How do you keep yourself motivated after a bad week?", "Specific habits, not just 'I stay positive'."]
  ]}
]},
{ id: "nursing", label: "Nursing", fit: ["nursing"], groups: [
  { name: "Clinical behavioral", kind: "star", qs: [
    ["Tell me about a time you cared for a difficult patient.", "Show empathy, patience and safety. Keep patient details private."],
    ["Describe a time you advocated for a patient.", "Speaking up to a doctor or the team when something didn't seem right."],
    ["Tell me about a time you made a mistake in clinicals. What did you do?", "Report it, fix it, learn from it. Honesty is what they're checking."],
    ["Tell me about a time a patient's condition changed quickly.", "What you noticed, who you called, what you did. Mention SBAR if you used it."],
    ["Describe a time you disagreed with a physician's order.", "Show you clarified it respectfully and followed the chain of command."],
    ["Tell me about a time you worked with a family member who was upset.", "Listen, explain what you can, involve the right people."],
    ["Tell me about a time you handled several patients needing you at once.", "Show how you prioritized: airway, breathing, circulation, and safety first."],
    ["Describe a time you worked with a coworker who wasn't following protocol.", "Patient safety comes first. Show how you raised it."],
    ["Tell me about your best clinical rotation and what you learned.", "Connect it to this unit."],
    ["Tell me about a time you comforted a patient or family after bad news.", "Shows emotional strength and compassion."]
  ]},
  { name: "Clinical knowledge", kind: "notes", qs: [
    ["Why nursing, and why this unit?", "A personal reason plus what draws you to this kind of patient care."],
    ["How do you prioritize care for your patients?", "ABCs, Maslow's hierarchy, acute versus chronic, and the nursing process."],
    ["What would you do if a patient refused medication?", "Find out why, educate, respect their right to refuse, document, and tell the provider."],
    ["How would you handle a patient who is about to fall?", "Guide them safely to the floor, call for help, assess, report and document."],
    ["What would you do if you suspected a coworker was impaired?", "Patient safety first. Report to the charge nurse or manager following policy."],
    ["How do you use SBAR?", "Situation, background, assessment, recommendation: a clear way to report to providers."],
    ["How do you prevent infections?", "Hand hygiene, PPE, sterile technique, isolation precautions."],
    ["What's your experience with Epic, Cerner or another EMR?", "Name the system and what you charted in it."],
    ["How do you handle stress during a hard shift?", "Specific habits and support you use."],
    ["When is your NCLEX, and how are you preparing?", "Have a date or plan and name your study method."],
    ["How do you stay current with nursing practice?", "Journals, continuing education, certifications you're working toward."],
    ["What would you do if you didn't know how to do a procedure you were assigned?", "Say so, ask a senior nurse or educator, look up the policy. Never guess."]
  ]}
]},
{ id: "health", label: "Healthcare, pharmacy & allied health", fit: ["nursing"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you protected someone's privacy.", "HIPAA matters. Show you understand it."],
    ["Describe a time you worked on a care team.", "Your role and how you communicated with others."],
    ["Tell me about a time you helped someone who was scared or confused.", "Patience and clear, simple language."],
    ["Tell me about a time you noticed a safety issue.", "How you reported it and what changed."]
  ]},
  { name: "Role questions", kind: "notes", qs: [
    ["Why healthcare?", "A personal story plus what you've done to explore it, such as shadowing or volunteering."],
    ["What would you do if a patient didn't understand their instructions?", "Teach-back: ask them to repeat it in their own words, then explain again simply."],
    ["How would you handle a patient upset about a long wait?", "Apologize, explain, give a time estimate, check in again."],
    ["What do you know about HIPAA?", "Protects patient health information. Share only what's needed with people who need it."],
    ["How do you handle bodily fluids or hard sights?", "Be honest and show you've been exposed in clinicals or volunteering."],
    ["Pharmacy: what would you do if you thought a prescription had an error?", "Don't fill it. Contact the prescriber to verify and document."],
    ["Pre-med: why medicine and not nursing or another health career?", "Show you understand the roles and what draws you to the physician path."],
    ["What would you do if a patient asked a question you can't answer?", "Tell them you'll find out or get the right person. Never guess."]
  ]}
]},
{ id: "teaching", label: "Teaching & education", fit: ["teaching"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a lesson that went really well.", "What you planned, what students did, how you knew they learned it."],
    ["Tell me about a lesson that didn't go as planned.", "How you adjusted in the moment and afterward."],
    ["Describe a time you helped a struggling student.", "How you figured out what they needed and the result."],
    ["Tell me about a time you handled a disruptive student.", "Calm, private, and focused on getting back to learning."],
    ["Tell me about a time you worked with a parent who was upset.", "Listen, share facts, make a plan together."],
    ["Describe a time you worked with other teachers or staff.", "Co-planning, an IEP meeting, a grade-level team."]
  ]},
  { name: "Teaching practice", kind: "notes", qs: [
    ["What's your teaching philosophy?", "Two or three beliefs, each with an example of how it shows up in your classroom."],
    ["How do you manage a classroom?", "Clear routines, relationships, consistent consequences. Give examples."],
    ["How do you differentiate instruction?", "Changing content, process or product for different learners, with an example."],
    ["How do you assess whether students are learning?", "Formative checks like exit tickets plus summative tests or projects."],
    ["How would you support English learners?", "Visuals, sentence frames, partner work, building vocabulary."],
    ["How would you support students with IEPs or 504 plans?", "Follow the plan, work with special education staff, track progress."],
    ["How do you use technology in your teaching?", "A specific tool and what it helped students do."],
    ["How do you build relationships with students?", "Learning names and interests, greeting them, showing you care."],
    ["How do you communicate with families?", "Regular updates, positive calls home, not only problems."],
    ["Teach us a short sample lesson.", "Many schools ask for a 10 to 15 minute demo. Have one ready with an opening, activity and check for understanding."],
    ["How would you teach a concept students keep getting wrong?", "Find the misconception, reteach a different way, check again."],
    ["What would you do if a student told you something concerning about their safety?", "You're a mandated reporter. Follow the school's reporting process right away."]
  ]}
]},
{ id: "engineering", label: "Engineering (mech, civil, electrical)", fit: ["trades", "tech"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about an engineering project you worked on. What was your role?", "Senior design, a lab, a club competition. Explain the design choices you made."],
    ["Describe a time a design didn't work the first time.", "How you tested, found the cause and redesigned."],
    ["Tell me about a time you worked within tight constraints: budget, weight, time.", "Engineering is about tradeoffs. Show which you chose and why."],
    ["Tell me about a time you had to explain a technical issue to a non-engineer.", "Clients and managers need plain language."],
    ["Tell me about a time safety affected a decision you made.", "Shows judgment."]
  ]},
  { name: "Technical", kind: "notes", qs: [
    ["Walk me through your senior design or capstone project.", "Problem, requirements, design options, why you chose yours, testing, results."],
    ["What CAD or analysis software have you used?", "SolidWorks, AutoCAD, Civil 3D, MATLAB, ANSYS. Say what you made with it."],
    ["Explain stress versus strain.", "Stress is force per area, strain is change in length divided by original length."],
    ["What's the difference between yield strength and ultimate strength?", "Yield is where permanent deformation starts, ultimate is the maximum stress before failure."],
    ["How would you choose a material for a part?", "Loads, environment, weight, cost, manufacturability."],
    ["Explain Ohm's law and give an example.", "Voltage equals current times resistance."],
    ["What's the difference between AC and DC?", "AC changes direction periodically, DC flows one way."],
    ["Civil: what do you consider when designing a stormwater system?", "Rainfall data, drainage area, soil, regulations, maintenance."],
    ["Are you an EIT, or planning to take the FE exam?", "Have a date or plan. Many firms ask about the path to a PE license."],
    ["What are GD&T and tolerances, and why do they matter?", "They define how much a part can vary and still work and fit."],
    ["How do you make sure your calculations are right?", "Check units, sanity-check magnitudes, have someone review."],
    ["What's a recent engineering project in the news you find interesting?", "Have one with a short opinion."]
  ]}
]},
{ id: "ops", label: "Operations & supply chain", fit: ["general", "trades"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you made a process faster or cheaper.", "Before and after numbers."],
    ["Describe a time something went wrong in a shipment, order or schedule.", "How you fixed it fast and prevented it next time."],
    ["Tell me about a time you managed a lot of moving parts.", "Show your tracking system."],
    ["Tell me about a time you worked with a vendor or supplier.", "Negotiation and relationships."]
  ]},
  { name: "Knowledge", kind: "notes", qs: [
    ["What is lean manufacturing?", "Removing waste and adding value for the customer. Mention a tool like 5S or value stream mapping."],
    ["What is Six Sigma?", "A data-driven method to reduce variation and defects, using DMAIC."],
    ["What KPIs would you track for a warehouse?", "Order accuracy, on-time shipping, inventory turns, cost per order, safety incidents."],
    ["How would you reduce excess inventory?", "Better forecasting, safety stock review, selling slow movers, supplier lead times."],
    ["What is just-in-time inventory, and what are its risks?", "Getting materials right when needed. Risk: supply disruptions."],
    ["A supplier is going to be two weeks late. What do you do?", "Find out impact, look for alternatives, tell customers early, adjust schedules."],
    ["How comfortable are you with Excel and ERP systems like SAP?", "Name specific tasks you've done."]
  ]}
]},
{ id: "hr", label: "HR & recruiting", fit: ["general"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you handled a sensitive conversation.", "Confidentiality and empathy."],
    ["Describe a time you helped someone resolve a workplace issue.", "Neutral, fair, follows policy."],
    ["Tell me about a time you had to enforce a rule people didn't like.", "Explain the why and stay consistent."],
    ["Tell me about a time you recruited people for something.", "A club, event or volunteer drive counts."]
  ]},
  { name: "Knowledge", kind: "notes", qs: [
    ["Why HR?", "Connect to helping people and helping the business."],
    ["How would you handle an employee complaint about their manager?", "Listen, document, follow policy, investigate fairly, keep it confidential."],
    ["What makes a good interview process?", "Structured questions tied to the job, trained interviewers, fair scoring."],
    ["How would you improve employee retention?", "Find out why people leave, then fix the biggest causes: pay, managers, growth."],
    ["What employment laws should every HR person know?", "Title VII, ADA, FMLA, FLSA and at-will employment basics."],
    ["How would you find candidates for a hard-to-fill role?", "Referrals, LinkedIn sourcing, schools, communities, and a clear job posting."],
    ["What HR systems have you used, such as Workday or ADP?", "Name what you've touched, or how you'd learn."]
  ]}
]},
{ id: "gov", label: "Government & public service", fit: ["general"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you served the public or your community.", "Volunteering, a job, a campus role."],
    ["Describe a time you followed a strict rule or procedure.", "Government work relies on consistency and documentation."],
    ["Tell me about a time you worked with people who had different priorities.", "Agencies work with many stakeholders."],
    ["Tell me about a time you handled sensitive information.", "Important for any role needing a background check or clearance."],
    ["Describe a time you had to explain a policy to someone upset by it.", "Calm, clear and respectful."]
  ]},
  { name: "Role questions", kind: "notes", qs: [
    ["Why public service?", "A specific mission or experience that drew you in."],
    ["Why this agency?", "Know its mission and a recent initiative."],
    ["Are you able to obtain a security clearance?", "Be honest about anything in your background. Clearance requires U.S. citizenship and a background check."],
    ["How do you stay neutral when you personally disagree with a policy?", "Your job is to carry it out fairly. Raise concerns through proper channels."],
    ["What do you know about how the federal hiring process works?", "USAJOBS, the resume matching the questionnaire, and structured panel interviews."],
    ["How would you prioritize when every task seems urgent?", "Mission impact, deadlines set by law or leadership, and asking your supervisor."]
  ]}
]},
{ id: "law", label: "Law, legal & policy", fit: ["general"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you researched something complex.", "Sources, method, and how you summarized it."],
    ["Describe a time your attention to detail caught an error.", "Legal work depends on precision."],
    ["Tell me about a time you wrote a persuasive argument.", "Debate, moot court, a paper."],
    ["Tell me about a time you managed several deadlines at once.", "Court and filing deadlines can't move."]
  ]},
  { name: "Role questions", kind: "notes", qs: [
    ["Why law, or why this practice area?", "A real experience plus what you've done to explore it."],
    ["Are you planning to go to law school?", "Be honest. Paralegal roles often value people who stay two years or more."],
    ["How do you keep client information confidential?", "Need to know only, secure storage, care with email."],
    ["What legal research tools have you used, such as Westlaw or Lexis?", "Name them and what you looked up."],
    ["How would you summarize a long document for an attorney?", "Key facts, issues and dates first, details after."],
    ["What policy issue do you care about, and why?", "Have an informed view and know the other side's best argument."]
  ]}
]},
{ id: "retail", label: "Retail, hospitality & service", fit: ["general"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you turned around an unhappy customer.", "Listen, apologize, fix, follow up."],
    ["Tell me about a time you worked a very busy shift.", "How you stayed fast and friendly."],
    ["Describe a time you helped a coworker during a rush.", "Teamwork in action."],
    ["Tell me about a time you upsold or recommended something to a customer.", "Show you matched it to what they needed."],
    ["Tell me about a time you handled cash or inventory carefully.", "Trustworthiness."]
  ]},
  { name: "Role questions", kind: "notes", qs: [
    ["What does great customer service mean to you?", "Give an example of service you received or gave."],
    ["What's your availability?", "Be honest and clear about nights, weekends and holidays."],
    ["What would you do if you saw someone shoplifting?", "Follow store policy: usually alert a manager or security, don't confront."],
    ["How would you handle a guest complaint about their room or meal?", "Apologize, fix it fast, and tell a manager if needed."],
    ["What would you do if a customer asked for something we don't carry?", "Suggest an alternative or help them find it elsewhere."],
    ["Why do you want to work here?", "Mention what you like about the store, brand or hotel as a customer."],
    ["Management trainee: how would you motivate a team on a slow day?", "Small goals, recognition, training time."]
  ]}
]},
{ id: "trades", label: "Skilled trades", fit: ["trades"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a job you're proud of.", "What it was, what you did, and how it turned out."],
    ["Tell me about a time you noticed a safety hazard.", "What you did about it."],
    ["Describe a time a job didn't go as planned.", "How you figured out the problem and fixed it."],
    ["Tell me about a time you worked with a difficult customer or homeowner.", "Clear communication and respect."],
    ["Tell me about a time you trained or helped a newer worker.", "Shows leadership."]
  ]},
  { name: "Role questions", kind: "notes", qs: [
    ["What licenses and certifications do you have?", "List them with the issuing body, such as OSHA 10 or 30, EPA 608, a journeyman card."],
    ["Which tools and equipment are you comfortable with?", "Be specific and honest."],
    ["How do you stay safe on the job?", "PPE, lockout/tagout, inspecting tools, speaking up."],
    ["Are you comfortable working at heights, outdoors, or in tight spaces?", "Be honest."],
    ["Do you have reliable transportation and a valid driver's license?", "Often required for job sites."],
    ["What would you do if you were unsure how to do part of a job?", "Ask a lead or check the code or manual. Never guess on safety."],
    ["How do you read blueprints or schematics?", "Explain your experience and an example."],
    ["Where do you want to be in your trade in five years?", "Journeyman, master, a specialty, or leading a crew."]
  ]}
]},
{ id: "science", label: "Research & lab science", fit: ["general", "nursing"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about your research project.", "Question, method, your role, results, and what's next. Practice a two-minute version."],
    ["Tell me about an experiment that failed.", "How you troubleshot it."],
    ["Describe a time you had to follow a protocol exactly.", "Reproducibility and safety."],
    ["Tell me about a time you presented your research.", "A poster, a lab meeting, a conference."]
  ]},
  { name: "Technical", kind: "notes", qs: [
    ["Which lab techniques are you comfortable with?", "PCR, cell culture, Western blot, chromatography. Say how often you've done each."],
    ["How do you keep a lab notebook?", "Dated, detailed and complete enough for someone to repeat your work."],
    ["How do you make sure your results are reliable?", "Controls, replicates, calibration, statistics."],
    ["What would you do if you got a result that contradicted your hypothesis?", "Check for errors, repeat it, then take the result seriously."],
    ["What safety training have you completed?", "Chemical hygiene, biosafety, and how you apply it."],
    ["What software do you use for data analysis?", "Excel, R, Python, GraphPad Prism, ImageJ."],
    ["Explain your research to someone outside your field.", "One sentence on the problem, one on what you did, one on why it matters."]
  ]}
]},
{ id: "design", label: "Design & UX", fit: ["creative"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Walk me through a project in your portfolio.", "The problem, your process, the choices you made and why, and the result."],
    ["Tell me about a time you received tough design feedback.", "Show you separated yourself from the work and improved it."],
    ["Describe a time you disagreed with a stakeholder about a design.", "User research or testing should settle it."],
    ["Tell me about a time you designed with constraints: brand rules, deadlines, tech limits.", "Constraints show your judgment."]
  ]},
  { name: "Craft", kind: "notes", qs: [
    ["What's your design process?", "Research, define, sketch, prototype, test, iterate. Show it on a real project."],
    ["How do you make designs accessible?", "Color contrast, text sizes, keyboard use, alt text, clear labels."],
    ["What tools do you use?", "Figma, Adobe Creative Cloud. Name what you use each for."],
    ["Critique an app you use every day.", "What works, one problem, and how you'd fix it."],
    ["How do you know a design is successful?", "Usability testing, task success, metrics after launch."],
    ["Do a quick design exercise: redesign a bus stop sign or a checkout screen.", "Ask who the users are and what they need first, then sketch."]
  ]}
]},
{ id: "nonprofit", label: "Nonprofit & social impact", fit: ["teaching", "general"], groups: [
  { name: "Behavioral", kind: "star", qs: [
    ["Tell me about a time you made a difference in your community.", "Specific people helped and a result."],
    ["Describe a time you did a lot with very little budget.", "Nonprofits value resourcefulness."],
    ["Tell me about a time you worked with volunteers.", "Recruiting, scheduling and keeping them engaged."],
    ["Tell me about a time you raised money or resources.", "Amount raised and how."]
  ]},
  { name: "Role questions", kind: "notes", qs: [
    ["Why our mission?", "A personal connection plus what you know about their programs."],
    ["How would you measure the impact of a program?", "Outputs (people served) and outcomes (what changed for them)."],
    ["How would you ask a donor for a gift?", "Build a relationship, connect the gift to impact, make a specific ask."],
    ["How do you avoid burnout in mission-driven work?", "Boundaries and support. Shows maturity."]
  ]}
]}
];

/* ---------- Company guides ---------- */
/* steps: commonly reported interview stages. look: what the company says it values or looks for.
   qs: questions and themes commonly reported for students and early-career roles.
   fields: ids from IP_FIELDS to suggest for more practice. */
const IP_CO_GROUPS = ["Banking & finance", "Accounting & consulting", "Tech", "Engineering & industry", "Consumer & retail", "Healthcare", "Government & defense", "Other big employers"];
const IP_COMPANIES = [
/* Banking & finance */
{ n: "Goldman Sachs", a: ["goldman", "gs"], g: 0, site: "goldmansachs.com", fields: ["ib", "behavioral"],
  steps: ["Online application", "Recorded video interview (HireVue) is commonly reported for the first round", "Superday: several back-to-back interviews with people from the division"],
  look: "Goldman's stated core values are partnership, client service, integrity and excellence. Expect questions that test each.",
  qs: [["Why Goldman Sachs, and why this division?", "Name people you've spoken with and what the division actually does."],
    ["Tell me about a time you worked as part of a team under pressure.", "Ties to partnership."],
    ["Tell me about a time you went the extra mile for someone you were serving.", "Ties to client service."],
    ["Tell me about a time you faced an ethical decision.", "Ties to integrity."],
    ["What's a market trend or recent deal you've been following?", "Have a view and know the numbers."],
    ["Pitch me a stock.", "Common for markets and asset management."],
    ["Walk me through a DCF.", "Common for investment banking."],
    ["What is something you'd change about our company?", "Be respectful and specific."]] },
{ n: "JPMorgan Chase", a: ["jp morgan", "jpmorgan", "chase", "jpmc", "jp morgan chase"], g: 0, site: "jpmorganchase.com", fields: ["ib", "corpfin", "behavioral"],
  steps: ["Online application and assessment", "Recorded video interview (HireVue) is commonly reported", "Final round or Superday with several interviewers"],
  look: "JPMorgan Chase publishes business principles around exceptional client service, operational excellence, integrity, fairness and responsibility, and a great team and winning culture.",
  qs: [["Why JPMorgan Chase?", "Mention its scale, a business line you like, and someone you met."],
    ["Tell me about a time you delivered excellent service to a client or customer.", "Ties to client service."],
    ["Tell me about a time you improved how something was done.", "Ties to operational excellence."],
    ["Tell me about a time you worked on a diverse team.", "Ties to team culture."],
    ["Tell me about a time you had to make a decision with incomplete information.", ""],
    ["What do you know about our different lines of business?", "Consumer & Community Banking, Commercial & Investment Bank, Asset & Wealth Management."],
    ["Explain a recent financial news story and how it affects us.", ""],
    ["Tell me about a time you failed.", ""]] },
{ n: "Morgan Stanley", a: ["ms", "morgan"], g: 0, site: "morganstanley.com", fields: ["ib", "behavioral"],
  steps: ["Online application", "Recorded video or phone first round is commonly reported", "Superday with several interviewers"],
  look: "Morgan Stanley's stated core values are do the right thing, put clients first, lead with exceptional ideas, commit to diversity and inclusion, and give back.",
  qs: [["Why Morgan Stanley over other banks?", "Wealth management strength is a good talking point."],
    ["Tell me about a time you did the right thing when it was hard.", "Ties to do the right thing."],
    ["Tell me about a time you put someone else's needs first.", "Ties to put clients first."],
    ["Tell me about an idea you came up with that others adopted.", "Ties to exceptional ideas."],
    ["Tell me about a time you gave back to your community.", "Ties to give back."],
    ["Where do you think interest rates are heading?", ""],
    ["Walk me through the three financial statements.", ""]] },
{ n: "Citi", a: ["citigroup", "citibank"], g: 0, site: "citigroup.com", fields: ["ib", "corpfin", "behavioral"],
  steps: ["Online application and assessment", "Recorded video interview (HireVue) is commonly reported", "Superday or final round"],
  look: "Citi describes itself as a global bank with clients in many countries. Show interest in international markets and clients.",
  qs: [["Why Citi?", "Its global footprint and specific business you want to join."],
    ["Tell me about a time you worked with people from different cultures or countries.", ""],
    ["Tell me about a time you took ownership of a problem.", ""],
    ["Tell me about a time you had to learn something quickly.", ""],
    ["What global economic trend are you following?", ""],
    ["Tell me about a time you had to persuade someone.", ""]] },
{ n: "Bank of America", a: ["bofa", "boa", "merrill", "merrill lynch"], g: 0, site: "bankofamerica.com", fields: ["ib", "corpfin", "behavioral"],
  steps: ["Online application", "Recorded video interview is commonly reported", "Superday or final interviews"],
  look: "Bank of America talks a lot about responsible growth and serving clients. Show you care about doing business the right way.",
  qs: [["Why Bank of America?", ""], ["Tell me about a time you worked toward a long-term goal.", ""],
    ["Tell me about a time you built trust with someone.", ""], ["Tell me about a time you handled a lot of detail.", ""],
    ["What do you know about Merrill and our wealth management business?", "Good if you're applying to wealth roles."],
    ["Walk me through a DCF.", "For investment banking roles."]] },
{ n: "Wells Fargo", a: ["wells"], g: 0, site: "wellsfargo.com", fields: ["corpfin", "behavioral"],
  steps: ["Online application", "Recorded video or phone screen", "Final interviews with the team"],
  look: "Wells Fargo stresses risk management, integrity and customer focus. Ethics questions are common.",
  qs: [["Why Wells Fargo?", ""], ["Tell me about a time you identified a risk and did something about it.", ""],
    ["Tell me about a time you had to choose between what was easy and what was right.", ""],
    ["Tell me about a time you helped a customer understand something complicated.", ""],
    ["Tell me about a time you worked on a team with a tight deadline.", ""],
    ["How would you explain a loan or credit product to a customer?", ""]] },
{ n: "Capital One", a: ["capone", "capital one"], g: 0, site: "capitalone.com", fields: ["consulting", "data", "swe"],
  steps: ["Online assessment", "Case interview is commonly reported for business analyst roles", "Final round (often called Power Day) with case, behavioral and role interviews"],
  look: "Capital One is known for data-driven case interviews, even for business roles. Practice math out loud.",
  qs: [["Walk me through how you'd decide whether to launch a new credit card offer.", "Classic case: customer response rate, profit per customer, costs, risk."],
    ["A marketing campaign costs $500,000 and brings in 2,000 customers worth $300 each. Is it worth it?", "Practice the math out loud."],
    ["Tell me about a time you used data to influence a decision.", ""],
    ["Tell me about a time you challenged the way things were done.", ""],
    ["Why Capital One?", "Tech-forward bank is a common angle."]] },
{ n: "Barclays", a: [], g: 0, site: "barclays.com", fields: ["ib", "corpfin", "behavioral"],
  steps: ["Online application and tests", "Video interview", "Assessment center or final interviews"],
  look: "Barclays' published values are respect, integrity, service, excellence and stewardship.",
  qs: [["Why Barclays?", ""], ["Tell me about a time you showed respect for a different point of view.", ""], ["Tell me about a time you went above and beyond for a customer.", ""], ["Tell me about a time you had to be accountable for a mistake.", ""], ["What's happening in the markets right now?", ""]] },
{ n: "BNY", a: ["bny mellon", "bank of new york"], g: 0, site: "bny.com", fields: ["corpfin", "data", "behavioral"],
  steps: ["Online application", "Phone or video screen", "Team interviews"],
  look: "BNY is a custody and asset-servicing bank. Know what that means: holding and servicing assets for institutions.",
  qs: [["What does BNY do, and how is it different from a retail bank?", ""], ["Tell me about a time you improved a process with technology.", ""], ["Tell me about a time accuracy really mattered.", ""], ["Why BNY?", ""]] },
{ n: "Fidelity Investments", a: ["fidelity"], g: 0, site: "fidelity.com", fields: ["corpfin", "swe", "behavioral"],
  steps: ["Online application", "Recruiter phone screen", "Behavioral and role interviews"],
  look: "Fidelity is focused on helping customers invest for the long term. Customer focus questions are common.",
  qs: [["Why Fidelity?", ""], ["Tell me about a time you helped someone make a financial decision.", ""], ["Tell me about a time you put a customer first.", ""], ["How would you explain a 401(k) to someone new to investing?", ""]] },
{ n: "Charles Schwab", a: ["schwab"], g: 0, site: "schwab.com", fields: ["corpfin", "behavioral"],
  steps: ["Online application", "Phone or video screen", "Behavioral interviews"],
  look: "Schwab talks about seeing the world 'through clients' eyes'. Show client empathy.",
  qs: [["Why Schwab?", ""], ["Tell me about a time you saw a problem from the customer's point of view.", ""], ["Tell me about a time you explained something complicated simply.", ""], ["What are you doing to learn about investing?", ""]] },
{ n: "American Express", a: ["amex"], g: 0, site: "americanexpress.com", fields: ["corpfin", "data", "marketing"],
  steps: ["Online application", "Video or phone interview", "Final round interviews"],
  look: "American Express is known for its focus on customer service and its brand.",
  qs: [["Why American Express?", ""], ["Tell me about a time you provided exceptional service.", ""], ["How would you grow card use among college students?", ""], ["Tell me about a time you used data to solve a business problem.", ""]] },
/* Accounting & consulting */
{ n: "PwC", a: ["pricewaterhousecoopers", "pricewaterhousecoopers (pwc)"], g: 1, site: "pwc.com", fields: ["accounting", "consulting"],
  steps: ["Online application and assessment", "Video or virtual first interview", "Final round with partners and managers"],
  look: "PwC's development framework, the PwC Professional, covers whole leadership, business acumen, technical capabilities, global acumen and relationships. Behavioral questions often map to these.",
  qs: [["Why PwC?", "Mention people you've met and the line of service you're applying to."],
    ["Why audit, tax or advisory?", ""],
    ["Tell me about a time you took the lead without being asked.", "Ties to whole leadership."],
    ["Tell me about a time you built a strong relationship with someone different from you.", "Ties to relationships."],
    ["Tell me about a business story in the news and why it matters.", "Ties to business acumen."],
    ["Tell me about a time you had to learn a technical skill quickly.", "Ties to technical capabilities."],
    ["Tell me about a time you worked with someone from another culture.", "Ties to global acumen."],
    ["What's your plan for the CPA?", ""]] },
{ n: "Deloitte", a: [], g: 1, site: "deloitte.com", fields: ["accounting", "consulting"],
  steps: ["Online application", "First-round behavioral interview", "Final round; consulting roles often include a case interview"],
  look: "Deloitte interviews are mostly behavioral. Consulting candidates should also practice cases.",
  qs: [["Why Deloitte?", ""], ["Why consulting (or audit, or tax)?", ""],
    ["Tell me about a time you worked on a team with conflict.", ""],
    ["Tell me about a time you had to adapt to a big change.", ""],
    ["Tell me about a time you made a recommendation based on analysis.", ""],
    ["A client's costs are rising faster than revenue. How would you approach it?", "Consulting case starter."],
    ["What do you know about our different businesses?", "Audit & Assurance, Consulting, Tax, Advisory."]] },
{ n: "EY", a: ["ernst & young", "ernst and young"], g: 1, site: "ey.com", fields: ["accounting", "consulting"],
  steps: ["Online application", "Video or first interview; EY in some regions uses strengths-based questions", "Final round with managers and partners"],
  look: "EY's purpose is 'building a better working world'. Strengths-based questions ask what energizes you, not only what you've done.",
  qs: [["Why EY?", ""], ["What do you enjoy doing most, and why?", "Strengths-based style. Answer honestly and with energy."],
    ["What does a good day look like for you?", "Strengths-based style."],
    ["Tell me about a time you learned from someone different from you.", ""],
    ["Tell me about a time you had to meet a tight deadline.", ""],
    ["How do you stay organized?", ""]] },
{ n: "KPMG", a: [], g: 1, site: "kpmg.com", fields: ["accounting", "consulting"],
  steps: ["Online application", "First interview, often behavioral", "Final round or office visit"],
  look: "KPMG emphasizes integrity, excellence, courage, together and 'for better'. Expect values-based behavioral questions.",
  qs: [["Why KPMG?", ""], ["Tell me about a time you showed courage by speaking up.", ""], ["Tell me about a time you worked with a team to deliver something excellent.", ""], ["Tell me about a time you made a mistake and corrected it.", ""], ["Why audit, tax or advisory?", ""]] },
{ n: "McKinsey & Company", a: ["mckinsey"], g: 1, site: "mckinsey.com", fields: ["consulting"],
  steps: ["Online problem-solving game (Solve) is commonly reported", "First round: case plus Personal Experience Interview", "Final round with partners"],
  look: "McKinsey's Personal Experience Interview goes deep on one story at a time, around themes like personal impact, entrepreneurial drive and leadership. Cases are usually interviewer-led.",
  qs: [["Tell me about a time you had to change someone's mind.", "Personal impact theme. Expect detailed follow-ups."],
    ["Tell me about a time you set a big goal and reached it despite obstacles.", "Entrepreneurial drive theme."],
    ["Tell me about a time you led a group through a challenge.", "Leadership theme."],
    ["Tell me about a time you created an environment where everyone could contribute.", ""],
    ["A client wants to cut costs by 15%. Where would you start?", "Practice structuring out loud."],
    ["Why McKinsey?", ""]] },
{ n: "Boston Consulting Group", a: ["bcg"], g: 1, site: "bcg.com", fields: ["consulting"],
  steps: ["Online case assessment (Casey) is commonly reported", "Case and fit interviews", "Final round with partners"],
  look: "BCG cases are often candidate-led and open-ended. They look for creative, structured thinking.",
  qs: [["Why BCG?", ""], ["Tell me about something you're proud of.", ""], ["A sports league wants to grow its fan base. What should it do?", "Open-ended creative case."],
    ["Tell me about a time you solved a problem in a new way.", ""], ["Estimate the number of smartphones sold in the U.S. each year.", ""]] },
{ n: "Bain & Company", a: ["bain"], g: 1, site: "bain.com", fields: ["consulting"],
  steps: ["Online assessment in some offices", "Case and fit interviews", "Final round"],
  look: "Bain cases are usually candidate-led. Bain is known for its team culture, so fit questions matter a lot.",
  qs: [["Why Bain?", ""], ["Tell me about a time you were part of a great team. What made it great?", ""], ["A private equity client wants to buy a company. What would you look at?", ""], ["Tell me about a time you had an impact on results.", ""]] },
{ n: "Accenture", a: [], g: 1, site: "accenture.com", fields: ["consulting", "swe", "it"],
  steps: ["Online application and assessment", "Video or first interview", "Final behavioral and role interviews"],
  look: "Accenture is consulting plus technology. Expect questions on tech trends and working with clients.",
  qs: [["Why Accenture?", ""], ["What technology trend do you think will change business the most?", "AI, cloud and cybersecurity are common answers. Have a specific example."],
    ["Tell me about a time you learned a new tool or technology.", ""], ["Tell me about a time you worked with a client or customer.", ""],
    ["Are you comfortable traveling for client work?", ""]] },
{ n: "Booz Allen Hamilton", a: ["booz allen", "booz"], g: 1, site: "boozallen.com", fields: ["consulting", "gov", "it"],
  steps: ["Online application", "Recruiter screen", "Behavioral and technical interviews; many roles require clearance eligibility"],
  look: "Booz Allen works mostly for government clients. Clearance eligibility and mission focus come up.",
  qs: [["Are you eligible for a security clearance?", ""], ["Why Booz Allen?", ""], ["Tell me about a time you worked on a mission bigger than yourself.", ""], ["Tell me about a time you solved a technical problem for a client.", ""]] },
/* Tech */
{ n: "Amazon", a: ["aws", "amazon web services"], g: 2, site: "amazon.jobs", fields: ["swe", "behavioral"],
  steps: ["Online assessment for many technical roles", "Phone or video screen", "Final loop of several interviews, including a 'Bar Raiser' from another team"],
  look: "Amazon interviews are built around its 16 Leadership Principles, such as Customer Obsession, Ownership, Dive Deep, Bias for Action and Deliver Results. Amazon itself recommends answering in STAR format.",
  qs: [["Tell me about a time you went above and beyond for a customer.", "Customer Obsession."],
    ["Tell me about a time you took on something outside your area of responsibility.", "Ownership."],
    ["Tell me about a time you made a decision quickly without all the data.", "Bias for Action."],
    ["Tell me about a time you had to dig into the details to solve a problem.", "Dive Deep."],
    ["Tell me about a time you disagreed with your team but committed to the decision.", "Have Backbone; Disagree and Commit."],
    ["Tell me about a time you found a simpler way to do something.", "Invent and Simplify."],
    ["Tell me about a time you delivered results under a tight deadline.", "Deliver Results."],
    ["Tell me about a time you did a lot with limited resources.", "Frugality."],
    ["Tell me about a time you earned the trust of a skeptical person.", "Earn Trust."],
    ["Tell me about a time you learned something new on your own.", "Learn and Be Curious."]] },
{ n: "Google", a: ["alphabet"], g: 2, site: "google.com", fields: ["swe", "pm", "data"],
  steps: ["Recruiter screen", "Technical phone or video interview for engineering roles", "Several final interviews: role-related, problem-solving and behavioral"],
  look: "Google says it hires for general cognitive ability, leadership, role-related knowledge and 'Googleyness' (comfort with ambiguity, collaboration, and doing the right thing).",
  qs: [["Tell me about a time you worked through an ambiguous problem.", "Googleyness theme."],
    ["Tell me about a time you helped a team succeed without being the leader.", "Emergent leadership theme."],
    ["How would you improve a Google product you use?", "Common for product roles."],
    ["Given an array of integers, find the longest increasing subsequence.", "Coding style. Talk through your approach first."],
    ["How would you design a system to store and search billions of photos?", "System design for experienced candidates."],
    ["Tell me about a time you had to make an ethical choice.", ""]] },
{ n: "Microsoft", a: ["msft"], g: 2, site: "microsoft.com", fields: ["swe", "pm"],
  steps: ["Recruiter screen", "Technical screen for engineering roles", "Final round of several interviews, mixing coding and behavioral"],
  look: "Microsoft's culture is built around growth mindset: learning from mistakes and curiosity.",
  qs: [["Tell me about a time you learned from a failure.", "Growth mindset."], ["Tell me about a time you got feedback that changed how you work.", ""],
    ["Why Microsoft?", ""], ["Design a feature for Teams that would help students.", "Product style."],
    ["Find whether a binary tree is balanced.", "Coding style."], ["Tell me about a time you worked with people across teams.", ""]] },
{ n: "Apple", a: [], g: 2, site: "apple.com", fields: ["swe", "engineering", "retail"],
  steps: ["Recruiter screen", "Team-specific technical or role interviews", "Final round with the team"],
  look: "Apple interviews vary a lot by team. Expect deep questions on your own projects and passion for the products.",
  qs: [["Why Apple?", "Be specific about a product and how it affected you."], ["Tell me about the project you're most proud of, in detail.", ""],
    ["How would you improve an Apple product?", ""], ["Tell me about a time you paid attention to a detail others missed.", ""],
    ["Retail: how would you help a customer who's frustrated with their device?", ""]] },
{ n: "Meta", a: ["facebook", "instagram"], g: 2, site: "metacareers.com", fields: ["swe", "pm", "data"],
  steps: ["Recruiter screen", "Technical screen for engineering roles", "Final round with coding, design (for experienced candidates) and behavioral"],
  look: "Meta's published values include move fast, focus on long-term impact, build awesome things and be direct and respect your colleagues.",
  qs: [["Tell me about a time you moved quickly to ship something.", "Move fast."], ["Tell me about a time you gave direct feedback.", "Be direct."],
    ["Tell me about a time you had a conflict with a teammate.", ""], ["How would you measure success for Instagram Stories?", "Product or data style."],
    ["Merge k sorted lists.", "Coding style."]] },
{ n: "NVIDIA", a: [], g: 2, site: "nvidia.com", fields: ["swe", "engineering"],
  steps: ["Recruiter screen", "Technical interviews with the team", "Final round"],
  look: "NVIDIA interviews often go deep into your resume projects. Hardware roles cover computer architecture; software roles often cover C++ and parallel programming.",
  qs: [["Walk me through your most technical project.", ""], ["What's the difference between a CPU and a GPU?", ""], ["Explain what a cache is and why it matters.", ""], ["Tell me about a time you optimized something for performance.", ""], ["Why NVIDIA?", ""]] },
{ n: "Palantir", a: [], g: 2, site: "palantir.com", fields: ["swe", "consulting"],
  steps: ["Online assessment or recruiter screen", "Technical interviews", "Final round, often including a 'decomposition' interview"],
  look: "Palantir is known for decomposition interviews: you break a large, vague real-world problem into parts and design a solution.",
  qs: [["How would you build software to help a city respond to floods?", "Decomposition style. Ask questions and break it into pieces."], ["Why Palantir?", ""], ["Tell me about a time you worked on a problem with no clear answer.", ""], ["Tell me about the hardest bug you've fixed.", ""]] },
{ n: "Salesforce", a: [], g: 2, site: "salesforce.com", fields: ["sales", "swe", "behavioral"],
  steps: ["Recruiter screen", "Hiring manager interview", "Panel or presentation round for some roles"],
  look: "Salesforce's core values are trust, customer success, innovation, equality and sustainability.",
  qs: [["Which Salesforce value matters most to you, and why?", ""], ["Tell me about a time you helped a customer succeed.", ""], ["Tell me about a time you built trust.", ""], ["Sales roles: walk me through how you'd run a discovery call.", ""]] },
{ n: "IBM", a: [], g: 2, site: "ibm.com", fields: ["swe", "consulting", "data"],
  steps: ["Online application and assessment", "Video or phone interview", "Technical or case interview for some roles"],
  look: "IBM looks for curiosity and continuous learning. Expect questions on AI, cloud or whatever the team builds.",
  qs: [["Why IBM?", ""], ["Tell me about a time you learned something new on your own.", ""], ["What do you know about IBM's work in AI or hybrid cloud?", ""], ["Tell me about a time you worked with a client or stakeholder.", ""]] },
{ n: "Tesla", a: [], g: 2, site: "tesla.com", fields: ["engineering", "swe"],
  steps: ["Online application, which asks for evidence of exceptional ability", "Phone screen", "Technical interviews with the team"],
  look: "Tesla is known for asking candidates to describe the hardest problems they've solved and how, in detail, to see if they really did the work.",
  qs: [["Tell me about some of the most difficult problems you've worked on and how you solved them.", "Be ready for very detailed follow-ups."], ["Why Tesla?", ""], ["Tell me about something you built with your own hands.", ""], ["How do you handle a fast pace and changing priorities?", ""]] },
{ n: "Oracle", a: [], g: 2, site: "oracle.com", fields: ["swe", "sales"],
  steps: ["Recruiter screen", "Technical or role interviews", "Final round"],
  look: "Oracle roles split between engineering and sales. Know which you're in and prepare accordingly.",
  qs: [["Why Oracle?", ""], ["Explain database normalization.", ""], ["Tell me about a time you persuaded someone.", "Sales roles."], ["Tell me about a project where you worked with data.", ""]] },
{ n: "Intel", a: [], g: 2, site: "intel.com", fields: ["engineering", "swe"],
  steps: ["Recruiter screen", "Technical interviews", "Final round"],
  look: "Intel interviews are mostly technical for engineers, with behavioral questions about teamwork and quality.",
  qs: [["Walk me through a semiconductor or hardware project.", ""], ["Explain how a transistor works.", ""], ["Tell me about a time you solved a quality problem.", ""], ["Why Intel?", ""]] },
/* Engineering & industry */
{ n: "Lockheed Martin", a: ["lockheed"], g: 3, site: "lockheedmartin.com", fields: ["engineering", "gov"],
  steps: ["Online application", "Behavioral interview, often with a panel", "Technical interview; many roles require U.S. citizenship and clearance eligibility"],
  look: "Lockheed Martin uses behavioral interviewing. Its values are do what's right, respect others and perform with excellence.",
  qs: [["Tell me about a time you did the right thing when no one was watching.", ""], ["Tell me about a technical project and your specific role.", ""], ["Tell me about a time you worked on a team with people from other disciplines.", ""], ["Are you eligible for a security clearance?", ""], ["Why aerospace and defense?", ""]] },
{ n: "Boeing", a: [], g: 3, site: "boeing.com", fields: ["engineering"],
  steps: ["Online application", "Behavioral interview", "Technical interview for engineering roles"],
  look: "Boeing emphasizes safety, quality and integrity. Expect questions on how you handle quality and safety concerns.",
  qs: [["Tell me about a time you raised a safety or quality concern.", ""], ["Why Boeing?", ""], ["Walk me through an engineering design you made.", ""], ["Tell me about a time you had to follow a strict process.", ""]] },
{ n: "RTX", a: ["raytheon", "pratt & whitney", "collins aerospace"], g: 3, site: "rtx.com", fields: ["engineering", "gov"],
  steps: ["Online application", "Behavioral and technical interviews", "Clearance eligibility for many roles"],
  look: "RTX includes Raytheon, Pratt & Whitney and Collins Aerospace. Know which business you're interviewing with.",
  qs: [["Which RTX business are you applying to, and what does it make?", ""], ["Tell me about a complex technical problem you solved.", ""], ["Tell me about a time you worked on a cross-functional team.", ""], ["Are you eligible for a security clearance?", ""]] },
{ n: "Northrop Grumman", a: ["northrop"], g: 3, site: "northropgrumman.com", fields: ["engineering", "gov"],
  steps: ["Online application", "Phone or panel interview", "Technical interviews; clearance eligibility for many roles"],
  look: "Northrop Grumman focuses on defense and space. Mission and clearance questions are common.",
  qs: [["Why defense or space?", ""], ["Tell me about a time you handled sensitive information.", ""], ["Walk me through a technical project.", ""], ["Tell me about a time you met a tough deadline.", ""]] },
{ n: "GE Aerospace / GE Vernova", a: ["ge", "general electric", "ge aerospace", "ge vernova", "ge healthcare"], g: 3, site: "ge.com", fields: ["engineering", "ops"],
  steps: ["Online application", "Recruiter or hiring manager screen", "Technical and behavioral interviews"],
  look: "GE companies talk about lean manufacturing and continuous improvement. Know basic lean ideas.",
  qs: [["Tell me about a time you improved a process.", ""], ["What do you know about lean or continuous improvement?", ""], ["Walk me through a technical project.", ""], ["Why aerospace or energy?", ""]] },
{ n: "Honeywell", a: [], g: 3, site: "honeywell.com", fields: ["engineering", "ops", "swe"],
  steps: ["Online application", "Phone or video screen", "Technical and behavioral interviews"],
  look: "Honeywell spans aerospace, automation and building technology. Know the business you're applying to.",
  qs: [["Why Honeywell?", ""], ["Tell me about a time you delivered results under pressure.", ""], ["Tell me about a technical problem you solved.", ""], ["Tell me about a time you worked with a customer.", ""]] },
{ n: "General Motors", a: ["gm"], g: 3, site: "gm.com", fields: ["engineering", "swe", "ops"],
  steps: ["Online application", "Recorded video or phone interview", "Behavioral and technical interviews"],
  look: "GM talks about its path to electric and autonomous vehicles. Show you know where the company is heading.",
  qs: [["Why GM?", ""], ["What do you think about the shift to electric vehicles?", ""], ["Tell me about a time you worked on a team project.", ""], ["Tell me about a technical problem you solved.", ""]] },
{ n: "Ford", a: ["ford motor"], g: 3, site: "ford.com", fields: ["engineering", "ops"],
  steps: ["Online application", "Video or phone interview", "Behavioral and technical interviews"],
  look: "Ford interviews are often behavioral. Know its product lines and EV plans.",
  qs: [["Why Ford?", ""], ["Tell me about a time you showed leadership.", ""], ["Tell me about a time you solved a problem creatively.", ""], ["What Ford vehicle would you improve, and how?", ""]] },
{ n: "Engineering design firms (AECOM, WSP, Stantec, HNTB, Jacobs)", a: ["aecom", "wsp", "stantec", "hntb", "jacobs", "atkinsrealis", "atkinsréalis", "kimley-horn", "burns & mcdonnell"], g: 3, site: "aecom.com", fields: ["engineering"],
  steps: ["Online application", "Phone screen", "Interview with the office or project team"],
  look: "Civil and environmental design firms ask about your path to licensure (FE, EIT, PE), software skills and real projects.",
  qs: [["Have you passed the FE exam, or when do you plan to?", ""], ["Which design software have you used, such as AutoCAD or Civil 3D?", ""], ["Tell me about a project where you worked with a client or public agency.", ""], ["Why civil engineering, and why this market (transportation, water, buildings)?", ""], ["Tell me about a time you had to check your work carefully.", ""]] },
{ n: "Bosch", a: ["robert bosch"], g: 3, site: "bosch.com", fields: ["engineering", "swe"],
  steps: ["Online application", "Phone or video interview", "Technical and behavioral interviews"],
  look: "Bosch makes everything from car parts to home appliances. Know the division you're applying to.",
  qs: [["Why Bosch?", ""], ["Tell me about a technical project.", ""], ["Tell me about a time you worked across cultures.", ""], ["Tell me about a time you improved quality.", ""]] },
{ n: "Semiconductor companies (TI, KLA, Applied Materials, ASML)", a: ["texas instruments", "ti", "kla", "applied materials", "asml", "globalfoundries", "analog devices", "nxp", "micron"], g: 3, site: "ti.com", fields: ["engineering"],
  steps: ["Online application", "Phone screen", "Technical interviews with the team"],
  look: "Expect questions on circuits, semiconductor physics, or equipment depending on the role.",
  qs: [["Explain how a MOSFET works.", ""], ["Walk me through a circuit or lab project.", ""], ["How does photolithography work, at a high level?", ""], ["Tell me about a time you troubleshot equipment or a test that wasn't working.", ""], ["Why semiconductors?", ""]] },
/* Consumer & retail */
{ n: "Procter & Gamble", a: ["p&g", "pg", "procter & gamble (p&g)"], g: 4, site: "pgcareers.com", fields: ["marketing", "ops", "behavioral"],
  steps: ["Online application", "Online assessment (P&G's PEAK Performance assessment)", "Behavioral interviews with managers"],
  look: "P&G interviews are strongly behavioral and focus on leadership, initiative and results. Have several detailed STAR stories ready.",
  qs: [["Tell me about a time you led others to achieve a result.", ""], ["Tell me about a time you came up with a new idea and made it happen.", ""], ["Tell me about a time you worked with others to reach a difficult goal.", ""], ["Tell me about a time you had to adapt to a big change.", ""], ["Tell me about a time you used data to make a decision.", ""], ["Why P&G, and which brand do you like?", ""]] },
{ n: "PepsiCo", a: ["pepsi", "frito-lay"], g: 4, site: "pepsicojobs.com", fields: ["marketing", "ops", "sales"],
  steps: ["Online application and assessment", "Video or phone interview", "Final behavioral interviews"],
  look: "PepsiCo looks for people who can act like owners and drive results.",
  qs: [["Why PepsiCo?", ""], ["Tell me about a time you acted like an owner.", ""], ["How would you grow sales of one of our brands?", ""], ["Tell me about a time you worked through a tough problem.", ""]] },
{ n: "Coca-Cola", a: ["coca cola", "coke"], g: 4, site: "coca-colacompany.com", fields: ["marketing", "sales"],
  steps: ["Online application", "Video or phone interview", "Behavioral interviews"],
  look: "Coca-Cola focuses on its brands and consumers. Know a recent campaign.",
  qs: [["Why Coca-Cola?", ""], ["Tell me about a recent Coca-Cola campaign you liked.", ""], ["Tell me about a time you worked with a diverse team.", ""], ["How would you market a new drink to Gen Z?", ""]] },
{ n: "Johnson & Johnson", a: ["j&j", "jnj"], g: 4, site: "jnj.com", fields: ["health", "engineering", "behavioral"],
  steps: ["Online application", "Video or phone interview", "Behavioral and role interviews"],
  look: "J&J's values come from Our Credo, which puts patients, doctors and nurses first. Many candidates are asked about it.",
  qs: [["What do you know about Our Credo?", ""], ["Tell me about a time you put others' needs first.", ""], ["Tell me about a time you worked across functions.", ""], ["Why healthcare?", ""]] },
{ n: "Target", a: [], g: 4, site: "target.com", fields: ["retail", "ops"],
  steps: ["Online application", "Phone or video interview", "Behavioral interviews; store leadership roles often include a store visit"],
  look: "Target interviews are behavioral and focus on guests and teams.",
  qs: [["Tell me about a time you gave great service to a guest or customer.", ""], ["Tell me about a time you led a team.", ""], ["Tell me about a time you handled a fast-paced environment.", ""], ["Why Target?", ""]] },
{ n: "Walmart", a: ["sams club", "sam's club"], g: 4, site: "careers.walmart.com", fields: ["retail", "ops", "swe"],
  steps: ["Online application and assessment for store roles", "Interviews with store or team leaders", "Tech and corporate roles add technical interviews"],
  look: "Walmart's values are respect for the individual, act with integrity, serve the customer and strive for excellence.",
  qs: [["Tell me about a time you served a customer well.", ""], ["Tell me about a time you showed respect for a coworker.", ""], ["Tell me about a time you acted with integrity.", ""], ["Why Walmart?", ""]] },
{ n: "Starbucks", a: [], g: 4, site: "starbucks.com", fields: ["retail"],
  steps: ["Online application", "Interview with a store manager", "Corporate roles add behavioral interviews"],
  look: "Starbucks interviews focus on customer connection and teamwork.",
  qs: [["Tell me about a time you made a customer's day.", ""], ["How would you handle a customer whose order was wrong?", ""], ["Tell me about a time you worked well on a team.", ""], ["What's your favorite drink, and why?", "A light opener."]] },
{ n: "Kraft Heinz", a: ["kraft", "heinz"], g: 4, site: "kraftheinz.com", fields: ["marketing", "ops"],
  steps: ["Online application", "Video interview", "Behavioral interviews"],
  look: "Kraft Heinz talks about ownership and results.",
  qs: [["Why Kraft Heinz?", ""], ["Tell me about a time you owned a result.", ""], ["How would you grow one of our brands?", ""], ["Tell me about a time you improved efficiency.", ""]] },
{ n: "Marriott International", a: ["marriott"], g: 4, site: "marriott.com", fields: ["retail"],
  steps: ["Online application and assessment", "Phone or video interview", "Interviews with property leaders"],
  look: "Marriott's core values are put people first, pursue excellence, embrace change, act with integrity and serve our world.",
  qs: [["Tell me about a time you put people first.", ""], ["Tell me about a time you handled a guest complaint.", ""], ["Tell me about a time you embraced a change at work.", ""], ["Why hospitality?", ""]] },
{ n: "Enterprise Mobility", a: ["enterprise", "enterprise rent-a-car"], g: 4, site: "careers.enterprise.com", fields: ["sales", "retail"],
  steps: ["Online application", "Phone screen", "Branch interview and a final interview with a manager"],
  look: "Enterprise's Management Training Program hires many new grads. They look for customer service, sales and leadership.",
  qs: [["Tell me about a time you provided excellent customer service.", ""], ["Tell me about a time you sold something or persuaded someone.", ""], ["Tell me about a time you led a group.", ""], ["Why the Management Training Program?", ""], ["How do you handle working weekends or long days?", ""]] },
/* Healthcare */
{ n: "CVS Health", a: ["cvs", "aetna"], g: 5, site: "cvshealth.com", fields: ["health", "retail", "data"],
  steps: ["Online application and assessment", "Recorded video or phone interview", "Interviews with the team"],
  look: "CVS Health includes pharmacies, Aetna insurance and clinics. Know which part you'd join.",
  qs: [["Why CVS Health?", ""], ["Tell me about a time you helped a customer or patient.", ""], ["How would you handle a customer upset about a prescription delay?", ""], ["Tell me about a time you protected sensitive information.", ""]] },
{ n: "HCA Healthcare", a: ["hca"], g: 5, site: "hcahealthcare.com", fields: ["nursing", "health"],
  steps: ["Online application", "Recruiter screen", "Unit manager or panel interview"],
  look: "HCA's mission begins 'Above all else, we are committed to the care and improvement of human life.' Nursing interviews are behavioral and clinical.",
  qs: [["Tell me about a time you advocated for a patient.", ""], ["How do you prioritize multiple patients?", ""], ["Tell me about a time you worked with a difficult family member.", ""], ["Why this hospital and unit?", ""]] },
{ n: "Mayo Clinic", a: ["mayo"], g: 5, site: "mayoclinic.org", fields: ["nursing", "health", "science"],
  steps: ["Online application", "Phone screen", "Behavioral and role interviews, often with a panel"],
  look: "Mayo Clinic's primary value is 'The needs of the patient come first.' Expect questions on teamwork and patient focus.",
  qs: [["Tell me about a time you put a patient's needs first.", ""], ["Tell me about a time you worked on a care team.", ""], ["Why Mayo Clinic?", ""], ["Tell me about a time you made a mistake and how you handled it.", ""]] },
{ n: "Kaiser Permanente", a: ["kaiser"], g: 5, site: "kaiserpermanente.org", fields: ["nursing", "health"],
  steps: ["Online application", "Phone screen", "Panel interview"],
  look: "Kaiser is both an insurer and a care provider. Know how that model works.",
  qs: [["Why Kaiser Permanente?", ""], ["Tell me about a time you helped someone take charge of their health.", ""], ["Tell me about a time you worked with people from many backgrounds.", ""], ["How do you handle a high patient load?", ""]] },
{ n: "Medtronic / Stryker (medical devices)", a: ["medtronic", "stryker", "boston scientific", "abbott"], g: 5, site: "medtronic.com", fields: ["engineering", "sales", "health"],
  steps: ["Online application", "Phone screen", "Technical, sales or behavioral interviews by role"],
  look: "Medical device companies focus on patient outcomes and quality. Sales roles often include a role-play.",
  qs: [["Why medical devices?", ""], ["Tell me about a time quality mattered in your work.", ""], ["Sales: pitch a product to a surgeon in two minutes.", ""], ["Tell me about a time you learned complex technical information quickly.", ""]] },
/* Government & defense */
{ n: "Federal government (USAJOBS)", a: ["usajobs", "federal", "va", "veterans health administration", "customs and border protection", "cbp", "irs", "dhs", "fbi"], g: 6, site: "usajobs.gov", fields: ["gov", "behavioral"],
  steps: ["USAJOBS application and questionnaire", "Structured interview, often by a panel asking every candidate the same questions", "Background check; some roles need a clearance"],
  look: "Federal interviews are structured and competency-based. Panels score your answers against the job's listed competencies, so match your STAR stories to them.",
  qs: [["Tell me about a time you dealt with a difficult member of the public.", ""], ["Tell me about a time you followed a policy you disagreed with.", ""], ["Tell me about a time you managed a heavy workload.", ""], ["Why do you want to work for this agency?", ""], ["Tell me about a time you worked with confidential information.", ""]] },
{ n: "Teach For America", a: ["tfa"], g: 6, site: "teachforamerica.org", fields: ["teaching", "nonprofit"],
  steps: ["Online application", "Activity or interview round", "Final interview, which has often included a short sample lesson"],
  look: "Teach For America looks for leadership, perseverance and a commitment to educational equity.",
  qs: [["Why Teach For America?", ""], ["Tell me about a time you persevered through a big challenge.", ""], ["Tell me about a time you led others to a goal.", ""], ["Teach a five-minute sample lesson.", ""]] },
/* Other */
{ n: "Marsh McLennan", a: ["marsh", "mercer", "oliver wyman", "guy carpenter"], g: 7, site: "marshmclennan.com", fields: ["corpfin", "consulting"],
  steps: ["Online application", "Video or phone interview", "Behavioral interviews"],
  look: "Marsh McLennan includes Marsh, Mercer, Guy Carpenter and Oliver Wyman. Know what the business you're applying to does.",
  qs: [["What does insurance brokerage do?", ""], ["Tell me about a time you built a client relationship.", ""], ["Tell me about a time you analyzed risk.", ""], ["Why this business?", ""]] },
{ n: "Travelers / insurance companies", a: ["travelers", "state farm", "allstate", "progressive", "liberty mutual", "geico"], g: 7, site: "travelers.com", fields: ["corpfin", "data", "sales"],
  steps: ["Online application and assessment", "Video or phone interview", "Behavioral interviews"],
  look: "Insurance companies hire underwriters, claims, actuarial and tech roles. Know which one you're interviewing for.",
  qs: [["What does an underwriter (or claims adjuster) do?", ""], ["Tell me about a time you made a decision based on risk.", ""], ["Tell me about a time you helped someone in a stressful situation.", ""], ["Why insurance?", ""]] }
];
