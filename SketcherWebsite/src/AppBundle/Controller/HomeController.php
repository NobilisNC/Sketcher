<?php

namespace AppBundle\Controller;

use AppBundle\Form\UserType;
use AppBundle\Form\SketchType;
use AppBundle\Form\CommentType;
use AppBundle\Entity\Tag;
use AppBundle\Entity\User;
use AppBundle\Entity\Sketch;
use AppBundle\Entity\Comment;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormError;

use Symfony\Component\HttpFoundation\Response;

class HomeController extends Controller
{
    /**
     * @Route("/", name="homepage")
     * @Route("/home/{page}", name="homepageLiteral")
     *
     */
    public function indexAction(Request $request, int $page = 0)
    {
        if($request->get('_route') == 'homepage')
            return $this->redirectToRoute('homepageLiteral');

        $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getMostLikedSketches($page, 16);


        return $this->render('home/index.html.twig',
            array (
                'sketches' => $sketches,
                'sketches_directory' => $this->getParameter('sketches_directory'),
                'total_sketches' => $this->getDoctrine()->getRepository('AppBundle:Sketch')->getNb()
            )
        );
    }

	/**
	 *
	 * @Route("/gallery/{page}", name="gallery",
     *         defaults = {"page" : 0} )
	 */
	public function galleryAction(Request $request, int $page = 0)
	{
        if ($request->get('sort') == 'like')
            $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getMostLikedSketches($page, 16);
        elseif ($request->get('searchSketch'))
            return $this->redirectToRoute('search_gallery', array('searchToken' => $request->get('searchSketch')));
         else
            $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getLastSketches($page, 16);



		return $this->render('home/gallery.html.twig',
            array (
                'sketches' => $sketches,
            	'sketches_directory' => $this->getParameter('sketches_directory'),
                'total_sketches' => $this->getDoctrine()->getRepository('AppBundle:Sketch')->getNb()
            )
        );
	}

    /**
     *
     * @Route("/gallery/user/{username}/{page}", name="user_gallery")
     */
    public function galleryByUserAction(Request $request, string $username, int $page = 0)
    {
        $number_page = 16;
        $db = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $db->findOneBy( array('username' => $username));
        $sketches = $user->getSketchesFrom($page, $number_page);

        return $this->redirectToRoute('search_gallery', array('searchToken' => "caca"));

        return $this->render('home/gallery.html.twig',
            array (
                'specific_user' => $user->getUsername(),
                'sketches' => $sketches,
                'sketches_directory' => $this->getParameter('sketches_directory'),
                'total_sketches' => $user->getNb()
            )
        );
    }

    /**
    * @Route("/gallery/search/{searchToken}/{page}", name="search_gallery")
    *
    */
    public function galleryBySearchAction(Request $request, string $searchToken, int $page = 0)
    {
        $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getSketchesTitleLike($searchToken, $page, 16);
        $nb = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getSketchesTitleLike_NB($searchToken);

        return $this->render('home/gallery.html.twig',
            array (
                'search' => $searchToken,
                'sketches' => $sketches,
                'sketches_directory' => $this->getParameter('sketches_directory'),
                'total_sketches' => $nb
            )
        );



    }

	/**
	 *
	 * @Route(
	 *   "/gallery/tag/{tag}/{page}",
	 *   requirements={"page": "\d+"},
     *   defaults={"page" : 0},
	 *   name="galleryByTag"
	 * )
	 */
	public function galleryByTagAction(Request $request, string $tag, int $page = 0)
	{
        $tag_e = $this->getDoctrine()->getRepository('AppBundle:Tag')->findOneByName($tag);

		$sketches = $tag_e ? $tag_e->getSketchesFrom($page, 16) : null;


		return $this->render('home/gallery.html.twig',
            array (
				'tag' => ( $tag_e ? $tag_e->getName() : $tag),
                'sketches' => $sketches,
            	'sketches_directory' => $this->getParameter('sketches_directory'),
                'total_sketches' => ($tag_e ? $tag_e->getNbSketches() : 0 )
            )
        );
	}

	/**
	 *
	 * @Route(
	 *   "/like/{sketchId}",
	 *   requirements={"sketchId": "\d+"},
	 *   name="like"
	 * )
	 * @Method({"GET"})
	 */
	public function likeAction(Request $request, int $sketchId)
	{
		$user = $this->getUser();

		if(!$user)
			return $this->redirectToRoute('login');

		$referer = $request->headers->get('referer');

		$db = $this->getDoctrine()->getManager();

		$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);

		$user->toggleLike($sketch);
		//var_dump($user->likes($sketch));

		$db->flush();

		// Go back to last page
		$lastPath = str_replace($request->getSchemeAndHttpHost(), '', $referer);

        $matcher = $this->get('router')->getMatcher();
        $parameters = $matcher->match($lastPath);
        $last_route = $parameters['_route'];


        return $this->redirectToRoute(
			$last_route,
			($last_route == 'showSketch' ? array('sketchId' => $sketch->getId()) : array() ));
	}

	/**
	 *
	 * @Route(
	 *   "/show/{sketchId}",
	 *   requirements={"sketchId": "\d+"},
	 *   name="showSketch"
	 * )
	 */
	public function showSketchAction(Request $request, int $sketchId)
	{
		$user = $this->getUser();

        $data = array('comment_form' => null);

		$db = $this->getDoctrine()->getRepository('AppBundle:Sketch');
		$sketch = $db->findOneById($sketchId);

        if($user) {
            $comment = new Comment();

            $form = $this->createForm(CommentType::class, $comment);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $comment->setAuthor($user);
                $comment->setSketch($sketch);

                $db = $this->getDoctrine()->getManager();
                $db->persist($comment);
                $db->flush();

				return $this->redirectToRoute('showSketch', array('sketchId' => $sketchId));
            }

			$data["comment_form"] = $form->createView();

            if($user->isAuthorOf($sketch)) {
                $form = $this->createForm(SketchType::class, $sketch);

                $data["sketch_form"] = $form->createView();
            }
        }



        $db = $this->getDoctrine()->getRepository('AppBundle:Comment');
        $data["comments"] = $db->findBy(array('sketch' => $sketch));

        $data["sketch"] = $sketch;


		return $this->render(
			'home/show_sketch.html.twig',
            $data
        );
	}

	/**
	 *
	 * @Route("/profile/{username}", name="profile")
	 */
	public function profileAction(Request $request, $username)
	{
		$user = $this->getDoctrine()
			->getRepository('AppBundle:User')
			->findOneBy(
				array('username' => $username)
			);

		return $this->render(
			'home/profile.html.twig',
			array(
				'name' => $username,
				'user' => $user
			)
		);
	}

	/**
	 *
	 * @Route("/me", name="editProfile")
	 */
	public function editProfileAction(Request $request)
	{
		$user = $this->getUser();

		if(!$user)
			return $this->redirectToRoute('login');

		$form = $this->createForm(UserType::class, $user);

		$form->remove('username')
		->remove('plainPassword')
		->add('plainPassword', PasswordType::class, array(
			'label' => 'Current password',
			'required' => true
		))
		->add('newPassword', RepeatedType::class, array(
			'required' => false,
			'mapped' => false,
			'type'	=> PasswordType::class,
			'first_options'		=> array('label' => 'Password'),
			'second_options'	=> array('label' => 'Repeat password')
		));

		$form->handleRequest($request);

		if($form->isSubmitted() && $form->isValid()) {
			if($this->get('security.password_encoder')->isPasswordValid(
				$user,
				$form->get('plainPassword')->getData()
			)) {
				if($form->get('newPassword')->getData()) { // New password requested
					$pass = $this->get('security.password_encoder')->encodePassword(
						$user,
						$form->get('newPassword')->getData()
					);
					$user->setPassword($pass);
				}

				$this->get('session')->set('_locale', $user->getLocale());

				$db = $this->getDoctrine()->getManager();
				$db->flush();

				return $this->redirectToRoute('editProfile');
			} else { // Wrong password
				$form->get('plainPassword')->addError(
					new FormError($this->get('translator')->trans("Wrong password."))
				);
			}
		}

		return $this->render(
			'home/edit_profile.html.twig',
			array(
				'form' => $form->createView()
			)
		);
	}

    /**
    *
    * @Route("/sketch/{sketchId}", name="sketch")
    */
	public function sketchAction(Request $request, int $sketchId)
    {
		$user = $this->getUser();

		if(!$user)
			return $this->redirectToRoute('gallery');

		$db = $this->getDoctrine()->getManager();
		$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);

		if($sketch && !$user->isAuthorOf($sketch))
			return $this->redirectToRoute('gallery');

		$sketch->addEditingUser($user);
		$token = $user->setEditToken();
		$db->flush();

		return $this->render(
			'home/sketch.html.twig',
			array(
				'sketch' => $sketch,
				'token' => $token
			)
		);
	}

    /**
    *
    * @Route("/new/sketch", name="newSketch")
    */
    public function newSketchAction(Request $request)
    {
        $user = $this->getUser();

        if(!$user)
            return $this->redirectToRoute('login');

        $sketch = new Sketch();

        $form = $this->createForm(SketchType::class, $sketch);

		$form->remove('authors');

        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()) {
			$db = $this->getDoctrine()->getManager();

            $ids = array();

            // On insere les nouveaux tags
            $r = $db->getRepository('AppBundle:Tag');
            foreach($form->get('tags')->getData() as $tag) {
                $t = $r->findOneByName($tag->getName());
                if(!$t) {
                    $db->persist($tag);
                    $sketch->addTag($tag);
                } else
                    $sketch->addTag($t);
            }

			// Create blank image
			$img = imagecreatetruecolor($sketch->getWidth(), $sketch->getHeight());
			imagefill($img, 0, 0, imagecolorallocate($img, 255, 255, 255));
			imagejpeg($img, $this->getParameter('sketches_directory').'/'.$sketch->getPath());

            $sketch->addAuthor($user);
			$sketch->setData('[{"name": "Background", "objects": []}]');

            $db->persist($sketch);
            $db->flush();

            return $this->redirectToRoute(
				'sketch',
				array(
					'sketchId' => $sketch->getId()
				)
			);
		}

        return $this->render('home/new_sketch.html.twig', array(
            'form' => $form->createView(),
        ));
    }

	////////////
	// FastInput and TagInput Ajax requests handling
	////////////

    /**
    *
    * @Route(
	*   "/title/set/{sketchId}/{name}",
	*   requirements={"sketchId": "\d+"},
	*   name="setSketchTitle"
	* )
    */
    public function setSketchTitleAction(Request $request, int $sketchId, string $name)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated."}');

		$db = $this->getDoctrine()->getManager();

		$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);

		if(!$sketch || !$user->isAuthorOf($sketch))
			return $res->setStatusCode(404)->setContent('{"status": "error", "msg": "'.$sketchId.' doesn\'t exist or is not accessible."}');

		$sketch->setName($name);
		$db->persist($sketch);
		$db->flush();

		return $res->setContent('{"status": "success", "msg": "Title has been updated."}');
	}

    /**
    *
    * @Route("/tag/search/{term}", name="searchTag")
    */
    public function searchTagAction(Request $request, string $term)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated"}');

		$db = $this->getDoctrine()->getRepository('AppBundle:Tag');
		$tags = $db->createQueryBuilder('p')
		->select('p.id, p.name')
		->where("p.name LIKE :term")
		->setParameter('term', $term.'%')
		->getQuery()
		->getResult();

		$json = "[";
		foreach($tags as $tag) {
			$json .= '{"id":'.$tag['id'].',"name":"'.$tag['name'].'"},';
		}
		$json = substr($json, 0, max(1, strlen($json)-1));
		$json .= "]";

		return $res->setContent($json);
	}

    /**
    *
    * @Route(
	*   "/tag/add/{term}/{sketchId}",
	*   requirements={"sketchId": "\d+"},
	*   name="addTag"
	* )
    */
    public function addTagAction(Request $request, string $term, int $sketchId)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated"}');

		$db = $this->getDoctrine()->getManager();
		$tag = $db->getRepository('AppBundle:Tag')->findOneByName($term);
		if(!$tag) {
			$tag = new Tag();
			$tag->setName($term);
			$db->persist($tag);
		}

		$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);
		$sketch->addTag($tag);
		$db->persist($sketch);

		$db->flush();

		return $res->setContent('{"status": "success", "msg": "Tag added", "id":'.$tag->getId().',"name":"'.$tag->getName().'"}');
	}

    /**
    *
    * @Route(
	*   "/tag/remove/{term}/{sketchId}",
	*   requirements={"sketchId": "\d+"},
	*   name="removeTag"
	* )
    */
    public function removeTagAction(Request $request, string $term, int $sketchId)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated"}');

		$db = $this->getDoctrine()->getManager();
		$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);
		$tag = $db->getRepository('AppBundle:Tag')->findOneByName($term);

		if(!$sketch)
			return $res->setStatusCode(404)->setContent('{"status": "error", "msg": "Sketch not found"}');

		$sketch->removeTag($tag);
		$db->persist($sketch);

		$db->flush();

		return $res->setContent('{"status": "success", "msg": "Tag removed"}');
	}

    /**
    *
    * @Route(
	*   "/author/search/{term}",
	*   name="searchAuthor"
	* )
    */
    public function searchAuthorAction(Request $request, string $term)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated"}');

		$db = $this->getDoctrine()->getRepository('AppBundle:User');
		$users = $db->createQueryBuilder('u')
		->select('u.id, u.username')
		->where("u.username LIKE :term AND u.username != :username")
		->setParameter('term', $term.'%')
		->setParameter('username', $user->getUsername())
		->getQuery()
		->getResult();

		$json = "[";
		foreach($users as $user) {
			$json .= '{"id":'.$user['id'].',"name":"'.$user['username'].'"},';
		}
		$json = substr($json, 0, max(1, strlen($json)-1));
		$json .= "]";

		return $res->setContent($json);
	}

    /**
    *
    * @Route(
	*   "/author/add/{username}/{sketchId}",
	*   requirements={"sketchId": "\d+"},
	*   name="addAuthor"
	* )
    */
    public function addAuthorAction(Request $request, string $username, int $sketchId)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated"}');

		$db = $this->getDoctrine()->getManager();
		$r = $db->getRepository('AppBundle:User')->findOneByUsername($username);
		if($r) {
			$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);
			$sketch->addAuthor($r);
			$db->persist($sketch);
			$db->flush();

			return $res->setContent('{"status": "success", "msg": "Author added", "id":'.$r->getId().',"name":"'.$r->getUsername().'"}');
		}
		else
			return $res->setStatusCode(404)->setContent('{"status": "error", "msg": "User doesn\'t exist."}');
	}

    /**
    *
    * @Route(
	*   "/author/remove/{username}/{sketchId}",
	*   requirements={"sketchId": "\d+"},
	*   name="removeAuthor"
	* )
    */
    public function removeAuthorAction(Request $request, string $username, int $sketchId)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$user = $this->getUser();

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You\'re not authenticated"}');

		$db = $this->getDoctrine()->getManager();
		$author = $db->getRepository('AppBundle:User')->findOneByUsername($username);
		$sketch = $db->getRepository('AppBundle:Sketch')->findOneById($sketchId);

		if(!$author || !$sketch || !$author->isAuthorOf($sketch))
			return $res->setStatusCode(404)->setContent('{"status": "error", "msg": "Sketch doesn\' exist or user doesn\'t exist or is not an author of this sketch"}');

		if($sketch->getAuthorsNumber() < 2)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "You cannot delete the last author of a sketch"}');

		$sketch->removeAuthor($author);
		$db->persist($sketch);
		$db->flush();

		return $res->setContent('{"status": "success", "msg": "Author removed"}');
	}
}
