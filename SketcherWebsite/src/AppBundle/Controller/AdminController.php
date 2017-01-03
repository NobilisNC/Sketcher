<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class AdminController extends Controller
{
    /**
     * @Route("/admin/users", name="usersAdmin")
     */
    public function usersAction(Request $request)
    {
		$user = $this->getUser();

		if(!$user || !$user->isAdmin())
			return $this->redirectToRoute('homepage');

        return $this->render('admin/users.html.twig', array(
			'users' => $this->getDoctrine()->getRepository('AppBundle:User')->findAll()
		));
    }
}
