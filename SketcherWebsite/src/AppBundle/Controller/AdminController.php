<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

class AdminController extends Controller
{
    /**
     * @Route("/admin/users/{page}", name="usersAdmin")
     */
    public function usersAction(Request $request, int $page = 0)
    {
		$user = $this->getUser();

		if(!$user || !$user->getIsAdmin())
			return $this->redirectToRoute('homepage');


            $nb_elemnts = $nb_elements = $this->getParameter('nb_elements_admin');

        return $this->render('admin/users.html.twig', array(
			'users' => $this->getDoctrine()->getRepository('AppBundle:User')->findBy(array(), array(), $nb_elements , $page * $nb_elements ),
            'total_users' => $this->getDoctrine()->getRepository('AppBundle:User')->getNb()
		));
    }

    /**
     * @Route("/admin/users/delete/{userId}", name="deleteUserAdmin")
     */
     public function deleteUserAction(Request $request, int $userId)
     {
         $user = $this->getUser();

         if(!$user || !$user->getIsAdmin())
             return $this->redirectToRoute('homepage');

        $db = $this->getDoctrine()->getManager();
        $user_delete = $db->getRepository('AppBundle:User')->findOneBy(array('id' =>$userId));

        // Delete sketch if last authors
        foreach($user_delete->getSketches() as $sketch)
            if($sketch->getAuthorsNumber() == 1)
                $db->remove($sketch);

        $db->remove($user_delete);
        $db->flush();

        return $this->redirectToRoute('usersAdmin');
     }

     /**
      * @Route("/admin/users/toggleAdmin/{userId}", name="toggleUserAdmin")
      */
      public function toggleUserAdminAction(Request $request, int $userId)
      {
          $user = $this->getUser();

          if(!$user || !$user->getIsAdmin())
              return $this->redirectToRoute('homepage');

         $db = $this->getDoctrine()->getManager();
         $u = $db->getRepository('AppBundle:User')->findOneBy(array('id' =>$userId));

		 if($u != $user && $user->getId() != 1) {
			 $this->get('session')->getFlashBag()->add('error', 'admin.permission.denied');
			 return $this->redirectToRoute('usersAdmin');
		 }

		 if($u->getIsAdmin()) {
			 if($user->getId() == 1 && $u == $user) {
				 $this->get('session')->getFlashBag()->add('error', ($u == $user ? 'admin.giveup.superadmin.denied' : 'admin.permission.denied'));
				 return $this->redirectToRoute('usersAdmin');
			 }

			 $u->setIsAdmin(false);
		 } else {
			 if($user->getId() != 1) {
				 $this->get('session')->getFlashBag()->add('error', 'admin.permission.denied');
				 return $this->redirectToRoute('usersAdmin');
			 }

			 $u->setIsAdmin(true);
		 }

		 $db->persist($u);
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

        $nb_elements = $this->getParameter('nb_elements_admin');
         return $this->render('admin/sketches.html.twig', array(
            'sketches' => $this->getDoctrine()->getRepository('AppBundle:Sketch')->findBy(array(), array(), $nb_elements , $page * $nb_elements ),
            'total_sketches' => $this->getDoctrine()->getRepository('AppBundle:Sketch')->getNb()
        ));
     }

     /**
      * @Route("/admin/sketches/delete/{sketchId}", name="deleteSketchAdmin")
      */
      public function deleteSketchAction(Request $request, int $sketchId)
      {
          $user = $this->getUser();

          if(!$user || !$user->getIsAdmin())
              return $this->redirectToRoute('homepage');

         $db = $this->getDoctrine()->getManager();
         $sketch_delete = $db->getRepository('AppBundle:Sketch')->findOneBy(array('id' =>$sketchId));

         $db->remove($sketch_delete);
         $db->flush();

         return $this->redirectToRoute('sketchesAdmin', $request->get('_route_params'));
      }

      /**
       * @Route("/admin/tags/{page}", name="tagsAdmin")
       */
      public function tagsAction(Request $request, int $page = 0)
      {
  		$user = $this->getUser();

  		if(!$user || !$user->getIsAdmin())
  			return $this->redirectToRoute('homepage');

        $nb_elements = $this->getParameter('nb_elements_admin');
          return $this->render('admin/tags.html.twig', array(
  			'tags' => $this->getDoctrine()->getRepository('AppBundle:Tag')->findBy(array(), array(), $nb_elements , $page * $nb_elements ),
            'total_tags' => $this->getDoctrine()->getRepository('AppBundle:Tag')->getNb()
  		));
      }

      /**
       * @Route("/admin/tag/delete/{tagId}", name="deleteTagAdmin")
       */
       public function deleteTagAction(Request $request, int $tagId)
       {
           $user = $this->getUser();

           if(!$user || !$user->getIsAdmin())
               return $this->redirectToRoute('homepage');

          $db = $this->getDoctrine()->getManager();
          $tag_delete = $db->getRepository('AppBundle:Tag')->findOneBy(array('id' =>$tagId));

          $db->remove($tag_delete);
          $db->flush();

          return $this->redirectToRoute('tagsAdmin', $request->get('_route_params'));
       }
}
