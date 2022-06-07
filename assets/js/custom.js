(function($)
{
	if(typeof window.ethereum !== 'undefined')
	{
		const showAccount = document.querySelector('.showAccount');
		const showSign = document.querySelector('.showSign');
		const showBalance = document.querySelector('.showBalance');

        //manage
        $('body').on('click', '.auth', function()
        {
        	//check metamask
        	if(window.ethereum.isMetaMask)
        	{
				try 
				{
					//connect to account
					connectToAccount();
				}
				catch (error)
				{
					console.error(error);
				}
        	}

        	return false;
        });

		//check metamask
		if(window.ethereum.isMetaMask)
		{
			console.log('MetaMask is installed!');
		}

		//init web 3
		web3 = new Web3(window.ethereum);

		// Subscribe to provider connection
		ethereum.on("connect", initConnect);

		//chain manage
		function initConnect(chainId)
		{
			//for cheking chainId
			console.log(chainId);

			return false;
		}

		//chain
		//init chain
		inithandleChainChanged();

		//listhen chain
		ethereum.on('chainChanged', inithandleChainChanged);

		//chain manage
		function inithandleChainChanged(chainId)
		{
			//check chainId
			if(chainId)
			{
				//if new chain reload window
				window.location.reload();
			}

			return false;
		}

		//account
		let currentAccount = null;
		
		//init account
		ethereum
		.request({method: 'eth_accounts'})
		.then(handleAccountsChanged)
		.catch((err) => 
		{
			console.error(err);
		});

		//account for the first time
		function connectToAccount()
		{
			ethereum
			.request({method: 'eth_requestAccounts'})
			.then(handleAccountsChanged)
			.catch((err) => 
			{
				if(err.code === 4001)
				{
					// EIP-1193 userRejectedRequest error
					// If this happens, the user rejected the connection request.
					console.log('Please connect to MetaMask.');
				}
				else
				{
					console.error(err);
				}
			});
		}

		//listhen account
		ethereum.on('accountsChanged', handleAccountsChanged);

		//account manage
		function handleAccountsChanged(accounts)
		{
			if(accounts.length === 0)
			{
				//MetaMask is locked or the user has not connected any accounts
				console.log('Please connect to MetaMask.');

				//disconnect data here
				//code..				
			}
			else if(accounts[0] !== currentAccount)
			{
				//get current account
				currentAccount = accounts[0];

				//show account
				showAccount.innerHTML = currentAccount;

				//check access to account
				getAuthData(currentAccount);
			}
		}

		//get access data
		async function getAuthData(account)
		{
			//send full form
            var auth = await $.post('data.php', {account:account}, 'json')

			//if not autorized sign it
			if(auth == 'true')
			{
				//sign account
				accountsSign(account);
			}
		}
		
		//sign
		async function accountsSign(account)
		{
			//show account 
			showAccount.innerHTML = account;

			//init variables
			var nonce = web3.utils.randomHex(8),
				message = message_hex = '',
				password = 'password'
			;

			//init message for the sign
			message = "Welcome to App! Click to sign in and accept authorization on this web site."
			message += "\nThis request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 24 hours.";
			message += "\nWallet address: "+account+".";
			message += "\nNonce: "+nonce+"";

			//use utils web3 for translate message to hex
			message_hex = web3.utils.utf8ToHex(message);

			//example - we have two types for send method request
			//eth_sign - simple
			//personal_sign - recomended

			//request to sign
			var sign = await ethereum.request(
			{
				method: 'personal_sign',
				params: [account, message_hex, password]
			})
			.catch((error) => {console.log(error)});

			//if sign request exists
			if(sign)
			{
				//show sign
				showSign.innerHTML = sign;

				//get balance
				handleAccountsBalance(account);

				//prepare data to save in backend
				var data = [{sign: sign, account: account, nonce: nonce, message: message, message_hex: message_hex}];

				//save auth data
				sendAuthData(data);
			}
		}

		//save account data
		function sendAuthData(data)
		{
            /*send full form*/
            $.post('data.php', {data:data}, function(response)
            {
            	//sended data
            	console.log(response);
                
            }, 'json')
		}

		//balance
		async function handleAccountsBalance(account)
		{
			//balance
			var balance = await ethereum
			.request(
			{
				method: 'eth_getBalance',
				params: [account, "latest"]
			});

			//show balance using by web3 utils
			showBalance.innerHTML = web3.utils.hexToNumberString(balance);
		}

	}

})(jQuery);
