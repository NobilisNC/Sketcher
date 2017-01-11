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

		if(!$user || !$user->getIsAdmin())
			return $this->redirectToRoute('homepage');

        return $this->render('admin/users.html.twig', array(
			'users' => $this->getDoctrine()->getRepository('AppBundle:User')->findAll()
		));
    }

    /**
     * @Route("/admin/delete/{userId}", name="deleteUserAdmin")
     */
     public function deleteUserAction(Request $request, int $userId)
     {
         $user = $this->getUser();

         if(!$user || !$user->getIsAdmin())
             return $this->redirectToRoute('homepage');

        $db = $this->getDoctrine()->getManager();
        $user_delete = $db->getRepository('AppBundle:User')->findOneBy(array('id' =>$userId));
        //Delete sketch if last authors
        foreach($user_delete->getSketches() as $sketch )
            if($sketch->getAuthorsNumber() == 1)
                $db->remove($sketch);

        $db->remove($user_delete);
        $db->flush();

        return $this->redirectToRoute('usersAdmin');
     }



     /**
      * @Route("/admin/sketches/{page}", name="sketchesAdmin")
      */
     public function sketchesAction(Request $request, int $page = 0)
     {
        $user = $this->getUser();

        if(!$user || !$user->getIsAdmin())
            return $this->redirectToRoute('homepage');

         return $this->render('admin/sketches.html.twig', array(
            'sketches' => $this->getDoctrine()->getRepository('AppBundle:Sketch')->findBy(array(), array(), 25, $page * 25 ),
            'total_sketches' => $this->getDoctrine()->getRepository('AppBundle:Sketch')->getNb()
        ));
     }

}
