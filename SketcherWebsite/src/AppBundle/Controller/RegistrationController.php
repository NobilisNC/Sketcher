<?php

namespace AppBundle\Controller;

use AppBundle\Form\UserType;
use AppBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class RegistrationController extends Controller
{
	/**
	 * @Route("/register", name="signup")
	 */
	public function registerAction(Request $request)
	{
		$user = new User();
		$form = $this->createForm(UserType::class, $user);

		$form->handleRequest($request);

		if($form->isSubmitted() && $form->isValid()) {
			$pass = $this->get('security.password_encoder')->encodePassword($user, $user->getPlainPassword());
			$user->setPassword($pass);

			$db = $this->getDoctrine()->getManager();
			$db->persist($user);
			$db->flush();

			return $this->redirectToRoute('homepage');
		}
		
		$translator = $this->get('translator');
		$translator->addResource('xlf', 'messages.fr.xlf', 'fr_FR');

		return $this->render('registration/user_register.html.twig', array(
			'form' => $form->createView()
		));
	}

}
