const is_touch_device = () => !!('ontouchstart' in window)


document.addEventListener('DOMContentLoaded', function () {
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Create JetPack instance
	const jetpack = new JetPack(true)

	var balances = null,
		TIA = null,
		dTIA = null,
		chain = 'pion-1'

	jetpack.on('error', message => {
		console.log('Error: ' + message)

		alert(message)
	})


	// Get connectWallet
	function connectWallet() {
		jetpack.connectWallet(chain).then(() => {
			balances = jetpack.getBalances()

			if (chain === 'mocha-4') {
				TIA = balances.find(balance => balance.denom === 'utia')
			} else {
				TIA = balances.find(balance => balance.denom === 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D')
			}

			dTIA = balances.find(balance => balance.denom === 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop')

			document.querySelector('.second_section .balance .val').innerHTML = dTIA ? (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent)).toFixed(3) : 0

			document.querySelector('.first_section').style.display = 'none'
			document.querySelector('.second_section').style.display = 'flex'
		}).catch(error => {
			alert(error)
		})
	}


	$('.stake_section .chain .mini_modal button').click(function(e) {
		e.preventDefault()

		chain = $(this).data('chain')

		$('.stake_section .chain .mini_modal button').removeClass('active')
		$(this).addClass('active')

		$('.stake_section .chain .current').html($(this).html())

		$('.mini_modal, .mini_modal_btn').removeClass('active')

		if (is_touch_device()) $('body').css('cursor', 'default')

		jetpack.switchChain(chain).then(() => {
			jetpack.loadBalances().then(() => {
				balances = jetpack.getBalances()

				if (chain === 'mocha-4') {
					TIA = balances.find(balance => balance.denom === 'utia')
				} else {
					TIA = balances.find(balance => balance.denom === 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D')
				}

				dTIA = balances.find(balance => balance.denom === 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop')

				document.querySelector('.second_section .balance .val').innerHTML = dTIA ? (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent)).toFixed(3) : 0

				document.querySelector('.stake_section .balance .val').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent)).toFixed(3)

				$('.stake_section .TIA_input, .stake_section .dTIA_input').val('')

				$('.stake_section .swap_btn, .stake_section .send_btn').removeClass('show')

				if (chain === 'pion-1') {
					$('.stake_section .swap_btn').addClass('show')
				} else {
					$('.stake_section .send_btn').addClass('show')
				}
			})
		})
	})


	$('.stake_section_btn').click(function(e) {
		e.preventDefault()

		document.querySelector('.stake_section .balance .val').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent)).toFixed(3)

		document.querySelector('.second_section').style.display = 'none'
		document.querySelector('.stake_section').style.display = 'flex'
	})


	$('.liquidity_section_btn').click(function(e) {
		e.preventDefault()

		document.querySelector('.liquidity_section .TIA_section .balance span').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent)).toFixed(3)

		document.querySelector('.liquidity_section .dTIA_section .balance span').innerHTML = (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent)).toFixed(3)

		document.querySelector('.liquidity_section .TIA_section .price span').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent) * TIA.price).toFixed(3)

		document.querySelector('.liquidity_section .dTIA_section .price span').innerHTML = (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent) * dTIA.price).toFixed(3)

		document.querySelector('.second_section').style.display = 'none'
		document.querySelector('.liquidity_section').style.display = 'flex'
	})


	$('.stake_section .back_btn, .liquidity_section .back_btn').click(function(e) {
		e.preventDefault()

		document.querySelector('.stake_section').style.display = 'none'
		document.querySelector('.liquidity_section').style.display = 'none'
		document.querySelector('.second_section').style.display = 'flex'
	})


	$('.stake_section .half_btn').click(function(e) {
		e.preventDefault()

		$('.stake_section .TIA_input').val(parseFloat(TIA.amount) / Math.pow(10, TIA.exponent) * 0.5)
		$('.stake_section .dTIA_input').val((parseFloat(TIA.amount) / Math.pow(10, TIA.exponent) * 0.9999 * 0.5).toFixed(4))

		$('.stake_section .swap_btn, .stake_section .send_btn').removeClass('disabled')
	})


	$('.stake_section .max_btn').click(function(e) {
		e.preventDefault()

		$('.stake_section .TIA_input').val(parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))
		$('.stake_section .dTIA_input').val((parseFloat(TIA.amount) / Math.pow(10, TIA.exponent) * 0.9999).toFixed(4))

		$('.stake_section .swap_btn, .stake_section .send_btn').removeClass('disabled')
	})


	$('.stake_section .TIA_input').keyup(function(e) {
		let _self = $(this)

		setTimeout(() => {
			if (parseFloat(_self.val()) > (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))) {
				// Set max
				_self.val(parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))
			}

			$('.stake_section .dTIA_input').val((_self.val() * 0.9999).toFixed(4))

			$('.stake_section .swap_btn, .stake_section .send_btn').removeClass('disabled')
		})
	})

	$('.stake_section .dTIA_input').keyup(function(e) {
		let _self = $(this)

		setTimeout(() => {
			if ((parseFloat(_self.val()) * 1.0001) > (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))) {
				// Set max
				_self.val(parseFloat(TIA.amount) / Math.pow(10, TIA.exponent) * 0.9999)
			}

			$('.stake_section .TIA_input').val((_self.val() * 1.0001).toFixed(4))

			$('.stake_section .swap_btn, .stake_section .send_btn').removeClass('disabled')
		})
	})


	$('.liquidity_section .TIA_input').keyup(function(e) {
		let _self = $(this),
			maxAmount = Math.min(parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent), parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))

		setTimeout(() => {
			if (parseFloat(_self.val()) > maxAmount) {
				// Set max
				_self.val(maxAmount)
			}

			$('.liquidity_section .dTIA_input').val(_self.val())

			$('.liquidity_section .pool_btn').removeClass('disabled')
		})
	})

	$('.liquidity_section .dTIA_input').keyup(function(e) {
		let _self = $(this),
			maxAmount = Math.min(parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent), parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))

		setTimeout(() => {
			if (parseFloat(_self.val()) > maxAmount) {
				// Set max
				_self.val(maxAmount)
			}

			$('.liquidity_section .TIA_input').val(_self.val())

			$('.liquidity_section .pool_btn').removeClass('disabled')
		})
	})


	$('.liquidity_section .max_btn').click(function(e) {
		e.preventDefault()

		let maxAmount = Math.min(parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent), parseFloat(TIA.amount) / Math.pow(10, TIA.exponent))

		$('.liquidity_section .TIA_input').val(maxAmount)
		$('.liquidity_section .dTIA_input').val(maxAmount)

		$('.liquidity_section .pool_btn').removeClass('disabled')
	})



	$('.modal_content .btn, .modal_overlay').click(function(e) {
		e.preventDefault()

		$('.modal').hide()
	})


	// Swap Tx
	function swapTX() {
		$('.modal').fadeIn(300)

		jetpack.sendTx([{
			typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
			value: {
				sender: jetpack.getAddress(),
				contract: 'neutron1kygcxajnu2euqwtc8hadqer84u9kcqmun70xxeq096h5esqqfs9qmus5gt',
				msg: new TextEncoder().encode(JSON.stringify({ bond: {} })),
				funds: [{
					denom: 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D',
					amount: `${parseFloat(document.querySelector('.stake_section .TIA_input').value) * Math.pow(10, TIA.exponent)}`
				}]
			}
		}]).then(result => {
			if (result.type === 'error') {
				alert(error)
			}

			if (result.type === 'tx') {
				jetpack.loadBalances().then(() => {
					balances = jetpack.getBalances()

					if (chain === 'mocha-4') {
						TIA = balances.find(balance => balance.denom === 'utia')
					} else {
						TIA = balances.find(balance => balance.denom === 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D')
					}

					dTIA = balances.find(balance => balance.denom === 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop')

					document.querySelector('.second_section .balance .val').innerHTML = dTIA ? (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent)).toFixed(3) : 0

					document.querySelector('.stake_section .balance .val').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent)).toFixed(3)

					$('.stake_section .TIA_input, .stake_section .dTIA_input').val('')

					document.querySelector('.stake_section').style.display = 'none'
					document.querySelector('.second_section').style.display = 'flex'

					$('.modal').hide()
				})
			}
		}).catch(error => {
			console.log(error)
		})
	}


	// Send Tx
	function sendTX() {
		$('.modal').fadeIn(300)

		jetpack.sendTx([{
			typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
			value: {
				sender: jetpack.getAddress(),
				receiver: 'neutron1kygcxajnu2euqwtc8hadqer84u9kcqmun70xxeq096h5esqqfs9qmus5gt',
				memo: "{\"wasm\":{\"contract\":\"neutron1kygcxajnu2euqwtc8hadqer84u9kcqmun70xxeq096h5esqqfs9qmus5gt\",\"msg\":{\"bond\":{\"receiver\":\"neutron1p4hc20yrucx4hk4lf68wmuzvsa0rrxkuua7grf\"}}}}",
				sourceChannel: 'channel-26',
				sourcePort: 'transfer',
				token: {
					denom: 'utia',
					amount: `${parseFloat(document.querySelector('.stake_section .TIA_input').value) * Math.pow(10, TIA.exponent)}`
				},
				timeoutHeight: {},
				timeoutTimestamp: (Date.now() + 60000) * 1e6
			}
		}]).then(result => {
			if (result.type === 'error') {
				alert(error)
			}

			if (result.type === 'tx') {
				chain = 'pion-1'

				$('.stake_section .chain .mini_modal button').removeClass('active')
				$('.stake_section .chain .mini_modal button[data-chain="pion-1"]').addClass('active')

				$('.stake_section .chain .current').html($('.stake_section .chain .mini_modal button[data-chain="pion-1"]').html())

				$('.mini_modal, .mini_modal_btn').removeClass('active')

				if (is_touch_device()) $('body').css('cursor', 'default')

				jetpack.switchChain(chain).then(() => {
					jetpack.loadBalances().then(() => {
						balances = jetpack.getBalances()

						if (chain === 'mocha-4') {
							TIA = balances.find(balance => balance.denom === 'utia')
						} else {
							TIA = balances.find(balance => balance.denom === 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D')
						}

						dTIA = balances.find(balance => balance.denom === 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop')

						document.querySelector('.second_section .balance .val').innerHTML = dTIA ? (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent)).toFixed(3) : 0

						document.querySelector('.stake_section .balance .val').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent)).toFixed(3)

						$('.stake_section .TIA_input, .stake_section .dTIA_input').val('')

						document.querySelector('.stake_section').style.display = 'none'
						document.querySelector('.second_section').style.display = 'flex'
					})
				})
			}
		}).catch(error => {
			console.log(error)
		})
	}


	// Pool Tx
	function poolTX() {
		$('.modal').fadeIn(300)

		jetpack.sendTx([{
			typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
			value: {
				sender: jetpack.getAddress(),
				contract: 'neutron16keevuz58qyu6jaj294cj3ulrtz3h02mg47gu4p95veuv7n783psajpwdk',
				funds: [
					{
						amount: `${parseFloat(document.querySelector('.liquidity_section .dTIA_input').value) * Math.pow(10, dTIA.exponent)}`,
						denom: 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop'
					},
					{
						amount: `${parseFloat(document.querySelector('.liquidity_section .TIA_input').value) * Math.pow(10, TIA.exponent)}`,
						denom: 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D'
					}
				],
				msg: new TextEncoder().encode(JSON.stringify({
					provide_liquidity: {
						assets: [
							{
								amount: `${parseFloat(document.querySelector('.liquidity_section .dTIA_input').value) * Math.pow(10, dTIA.exponent)}`,
								info: {
									'native_token': {
										denom: 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop'
									}
								}
							},
							{
								amount: `${parseFloat(document.querySelector('.liquidity_section .TIA_input').value) * Math.pow(10, TIA.exponent)}`,
								info: {
									'native_token': {
										denom: 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D'
									}
								}
							}
						],
						'auto_stake': false
					}
				}))
			}
		}]).then(result => {
			if (result.type === 'error') {
				alert(error)
			}

			if (result.type === 'tx') {
				jetpack.loadBalances().then(() => {
					balances = jetpack.getBalances()

					if (chain === 'mocha-4') {
						TIA = balances.find(balance => balance.denom === 'utia')
					} else {
						TIA = balances.find(balance => balance.denom === 'ibc/4CDD4BA98A61F9F797CE9C83582AB2DC48AF464C585BF4895A0604C10BE5CE3D')
					}

					dTIA = balances.find(balance => balance.denom === 'factory/neutron1tkr6mtll5e2z53ze2urnc3ld3tq3dam2rchezc5lg9c237ft66gqtw94jm/drop')

					document.querySelector('.second_section .balance .val').innerHTML = dTIA ? (parseFloat(dTIA.amount) / Math.pow(10, dTIA.exponent)).toFixed(3) : 0

					document.querySelector('.stake_section .balance .val').innerHTML = (parseFloat(TIA.amount) / Math.pow(10, TIA.exponent)).toFixed(3)

					$('.stake_section .TIA_input, .stake_section .dTIA_input').val('')

					document.querySelector('.liquidity_section').style.display = 'none'
					document.querySelector('.second_section').style.display = 'flex'
				})
			}
		}).catch(error => {
			console.log(error)
		})
	}


	// Add click event listener to the button
	document.querySelector('.connect_btn').addEventListener('click', connectWallet)
	document.querySelector('.swap_btn').addEventListener('click', swapTX)
	document.querySelector('.send_btn').addEventListener('click', sendTX)
	document.querySelector('.pool_btn').addEventListener('click', poolTX)
})