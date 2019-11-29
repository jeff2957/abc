'use strict'

let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');

let update = $('#update');

let transferTo = $('#transferTo');
let transferButton = $('#transferButton');

let buyButton = $('#buyButton')

let accountButton = $('#accountButton')

let withdrawButton = $('withdrawButton')

let nowAccount = "";

// 載入使用者至 select tag
$.get('/accounts', function (accounts) {
	for (let account of accounts) {
		whoami.append(`<option value="${account}">${account}</option>`)
	}
	nowAccount = whoami.val();
	update.trigger('click')
})

// 當按下登入按鍵時
whoamiButton.on('click', async function () {
	nowAccount = whoami.val();
	update.trigger('click')
})

// 當按下更新按鍵時
// accountButton.on('click', function () {
// 	$('.collapse').on('show.bs.collapse', function (e) {
// 		// Get clicked element that initiated the collapse...
// 		clicked = $(document).find("[href='#account" + $(e.target).attr('accordion') + "']")
// 	},
// 	$.get('/allTickets', {
// 		account: nowAccount
// 	}, 
// 	function (result) {
// 		//你看看下面那個有沒有問題


// 		//得到帳號擁有的票券後，以列表的形式將票券顯示於前端。
// 		//(個人覺得會類似下面的寫法)
// 		//for (let ticket of tickets) {
// 		//	_.append(`<option value="${account}">${account}</option>`)
// 		//}
// 		//功能的按鈕也許可用collapse
// 		// for (let ticket of tickets){
// 		// 	$("b").append(`<option value="${account}">${account}</option>`)


// 	})
// })

accountButton.on('click', function () {
	$.ajax({
		type: 'GET',
		url: 'xxx', //補個url要到哪抓資料
		data: {
			ticket: 'text'
		},
		dataType: 'json', //這個datatype正確嗎
		success: function (response) {
			$.each(response, function (index, element) {
				$('.info').append(
					$('<li>', {
						text: ticket
					}),
					$('<p>')
				);
			});
		}
	})
})



// 轉移票券
transferButton.on('click', async function () {
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 交易
	$.post('/transfer', {
		account: nowAccount,
		to: transferTo.val()
		//,value: ticketValue 自動輸入該票券地址
	}, function (result) {
		if (result.events !== undefined) {
			// 觸發更新帳戶資料
			update.trigger('click')
		}

	})
})

//購買票券
buyButton.on('click', async function () {
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 買票
	$.post('/buyTicket', {
		account: nowAccount,
	}, function (result) {
		if (result.events !== undefined) {
			// 觸發更新帳戶資料
			update.trigger('click')
		}

	})
})

// buyButton.on('click', async function () {
// 	// 解鎖
// 	let unlock = await unlockAccount();
// 	if (!unlock) {
// 		return;
// 	}

// 	// 買票
// 	$.get('/allTicket', {
// 		account: nowAccount,
// 	}, function (result) {
// 		if (result.events !== undefined) {
// 			// 觸發更新帳戶資料
// 			update.trigger('click')
// 		}

// 	})
// })

// 退票時
refundButton.on('click', async function () {
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 退票
	$.post('/refund', {
		account: nowAccount,
		to: transferTo.val()
		//,value: ticketValue 自動輸入該票券地址
	}, function (result) {
		if (result.events !== undefined) {
			// 觸發更新帳戶資料
			update.trigger('click')
		}

	})
})

// 取回Ether
withdrawButton.on('click', async function () {
	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 轉帳
	$.post('/withdraw', {
		account: nowAccount,
		value: parseInt(withdraw.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			// 觸發更新帳戶資料
			update.trigger('click')
		}
	})
})

function showDataAfterToggle() {
	$('.collapse').on('show.bs.collapse', function (e) {
		// Get clicked element that initiated the collapse...
		clicked = $(document).find("[href='#account" + $(e.target).attr('accordion') + "']")
	});
}


function waitTransactionStatus() {
	$('#accountStatus').html('帳戶狀態 <b style="color: blue">(等待交易驗證中...)</b>')
}

function doneTransactionStatus() {
	$('#accountStatus').text('帳戶狀態')
}


async function unlockAccount() {
	let password = prompt("請輸入你的密碼", "");
	if (password == null) {
		return false;
	} else {
		return $.post('/unlock', {
				account: nowAccount,
				password: password
			})
			.then(function (result) {
				if (result == 'true') {
					return true;
				} else {
					alert("密碼錯誤")
					return false;
				}
			})
	}
}