<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 *
 * @author zanymonk
 */
class SecurityController extends Controller {
	/**
	* @Route("/login", name="login")
	*/
	public function loginAction(Request $request)
	{
		$utils = $this->get('security.authentication_utils');
		
		$error = $utils->getLastAuthenticationError();
		$lastUsername = $utils->getLastUsername();
		
		return $this->render('security/login.html.twig', array(
			'last_username'	=> $lastUsername,
			'error'			=> $error
		));
	}
}
