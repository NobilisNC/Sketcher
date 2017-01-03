<?php

namespace AppBundle\Controller;

use AppBundle\Form\UserType;
use AppBundle\Form\SketchType;
use AppBundle\Form\CommentType;
use AppBundle\Entity\User;
use AppBundle\Entity\Sketch;
use AppBundle\Entity\Comment;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormError;

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
	 * @Route("/gallery", name="gallery")
	 */
	public function galleryAction(Request $request)
	{
        //$sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getLastSketches(10);
        $sketches = $this->getDoctrine()->getRepository('AppBundle:Sketch')->getMostLikedSketches();

		return $this->render('home/gallery.html.twig',
            array (
                'sketches' => $sketches,
            	'sketches_directory' => $this->getParameter('sketches_directory')
            )
        );
	}

	/**
	 *
	 * @Route(
	 *   "/gallery/{sketchId}",
	 *   requirements={"sketchId": "\d+"},
	 *   name="showSketch"
	 * )
	 */
	public function showSketchAction(Request $request, int $sketchId)
	{
        $data = array('form' => null);

		$db = $this->getDoctrine()->getRepository('AppBundle:Sketch');
		$sketch = $db->findOneBy(array(
			'id' => $sketchId
		));



        $user = $this->getUser();


        if($user) {
            $comment = new Comment();

            $form = $this->createForm(CommentType::class, $comment);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $comment->setAuthor($user);
                $comment->setSketch($sketch);

                echo $comment->getId();

                $db = $this->getDoctrine()->getManager();
                $db->persist($comment);
                $db->flush();
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
				$db->persist($user);
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
		return $this->render('home/sketch.html.twig');
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

        if ($form->isSubmitted() && $form->isValid()) {
			// Create blank image
			$img = imagecreatetruecolor($sketch->getWidth(), $sketch->getHeight());
			imagefill($img, 0, 0, imagecolorallocate($img, 255,255,255));
			imagejpeg($img, $this->getParameter('sketches_directory').'/'.$sketch->getPath());

			// $file = $sketch->getPath();
            // // Generate a unique name for the file before saving it
            // $fileName = md5(uniqid()).'.'.$file->guessExtension();
			//
			//
            // $file->move(
            //      $this->getParameter('sketches_directory'),
            //     $fileName
            // );
			//
            // $sketch->setPath($fileName);


            $sketch->addAuthor($user);

            $db = $this->getDoctrine()->getManager();
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



}
