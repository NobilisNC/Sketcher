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
     * @Route("/home", name="homepageLiteral")
     */
    public function indexAction(Request $request)
    {
        return $this->render('home/index.html.twig');
    }

	/**
	 *
	 * @Route("/gallery/{page}", name="gallery",
     *         defaults = {"page" : 0} )
	 */
	public function galleryAction(Request $request, int $page)
	{
        $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getMostLikedSketches($page, 16);
        //$sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getLastSketches($page, 16);


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
     * @Route("/galleryof/{username}/{page}", name="user_gallery")
     */
    public function user_galleryAction(Request $request, string $username, int $page = 0)
    {
        $number_page = 16;
        $db = $this->getDoctrine()->getRepository('AppBundle:User');
        $user = $db->findOneBy( array('username' => $username));
        $sketches = $user->getSketchesFrom($page, $number_page);


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
	 *
	 * @Route(
	 *   "/gallery/tag/{tag}/{page}",
	 *   requirements={"tag": "[\-a-z\d]+"},
     *   defaults={"page" : 0},
	 *   name="galleryByTag"
	 * )
	 */
	public function galleryByTagAction(Request $request, string $tag, int $page)
	{
        $tag = $this->getDoctrine()->getRepository('AppBundle:Tag')->findOneByName($tag);

		$sketches = $tag ? $tag->getSketchesFrom($page, 16) : null;


		return $this->render('home/gallery.html.twig',
            array (
				'tag' => $tag->getName(),
                'sketches' => $sketches,
            	'sketches_directory' => $this->getParameter('sketches_directory'),
                'total_sketches' => $tag->getNbSketches()
            )
        );
	}


    // UNUSED !!!! delete ?
	/**
	 *
	 * @Route("/me/sketches", name="mySketches")
	 */
	public function mySketchesAction(Request $request)
	{
		$user = $this->getUser();

		if(!$user)
			return $this->redirectToRoute('login');

        // $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->createQueryBuilder('s')
		// 	->where('s.')
		// 	->getQuery()
		// 	->getResult();

		return $this->render('home/my_sketches.html.twig',
            array (
				'sketches' => $user->getSketches()
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
		// if($user->likes($sketch))
		// 	$this->get('session')->getFlashBag()->add('already.liked', 'true');
		// else
		$user->toggleLike($sketch);
		var_dump($user->likes($sketch));

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

        $data = array('form' => null);

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

			$data["form"] = $form->createView();
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
	public function sketchAction(Request $request, $sketchId)
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
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid() || $form->get('name')->getData() == 'caca') {
			$db = $this->getDoctrine()->getManager();


            $ids = array();

            //On insere les nouveaux tags
            $r = $db->getRepository('AppBundle:Tag');
            foreach($form->get('tags')->getData() as $tag) {
                // $sketch->addTag($tag);
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
			$sketch->setData('{"width":'.$sketch->getWidth().',"height":'.$sketch->getHeight().',"layers":{}}');


            $db->persist($sketch);
            $db->flush();


            return $this->redirectToRoute(
				'sketch',
				array(
					'sketchId' => $sketch->getId()
				)
			);
        } else {
			echo $form->getErrors();
		}

        return $this->render('home/new_sketch.html.twig', array(
            'form' => $form->createView(),
        ));
    }

	////////////
	// TagInput Ajax requests handling
	////////////

    /**
    *
    * @Route("/tag/search/{term}", name="searchTag")
    */
    public function searchTagAction(Request $request, string $term)
    {
		$user = $this->getUser();

		if(!$user)
			return $this->redirectToRoute('login');

		$db = $this->getDoctrine()->getRepository('AppBundle:Tag');
		$tags = $db->createQueryBuilder('p')
		->select('p.id, p.name')
		->where("p.name LIKE :term")
		->setParameter('term', $term.'%')
		->getQuery()
		->getResult();

		$res = "[";
		foreach($tags as $tag) {
			$res .= '{"id":'.$tag['id'].',"name":"'.$tag['name'].'"},';
		}
		$res = substr($res, 0, max(1, strlen($res)-1));
		$res .= "]";

		return new Response($res);
	}

    /**
    *
    * @Route(
	*   "/tag/add/{term}",
	*   requirements={"term": "\w+"},
	*   name="addTag"
	* )
    */
    public function addTagAction(Request $request, string $term)
    {

		$user = $this->getUser();

		if(!$user)
			return $this->redirectToRoute('login');

		$db = $this->getDoctrine()->getManager();
		$r = $db->getRepository('AppBundle:Tag')->findOneByName($term);
		if(!$r) {
			$tag = new Tag();
			$tag->setName($term);

			$db->persist($tag);
			$db->flush();
		} else {
			$tag = $r;
		}

		return new Response('{"id":'.$tag->getId().',"name":"'.$tag->getName().'"}');
	}
}
