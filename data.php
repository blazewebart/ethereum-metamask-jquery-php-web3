<?php

//check and saved data, for instance use mysql or other	

//save data to database
if(isset($_POST['data']))
{
	//save data
	//notice: use php libraries as Keccak and others for check sign on backend side
	print_r($_POST['data']);

	exit;
}
//check auth data
elseif(isset($_POST['account']))
{
	//for true
	//notice: get data from mysql and check if true it means user not authorized and you need a sign and after send data to auth user in your app
	
	echo 'true';

	//for false
	//notice: get data from mysql check data if false it means user authorized and you don`t need a sign
	
	//echo 'false';

	exit;
}
