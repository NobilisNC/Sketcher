<?php

namespace AppBundle\Controller;

use AppBundle\Form\SketchType;
use AppBundle\Entity\Sketch;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

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
		return $this->render('home/gallery.html.twig');
	}

    /**
    *
    * @Route("/home/upload", name="upload_sketch")
    */
    public function uploadAction(Request $request)
    {

        $sketch = new Sketch();

        $form = $this->createForm(SketchType::class, $sketch);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            /** @var Symfony\Component\HttpFoundation\File\UploadedFile $file */
            $file = $sketch->getPath();

            // Generate a unique name for the file before saving it
            $fileName = md5(uniqid()).'.'.$file->guessExtension();


            $file->move(
                 $this->getParameter('sketches_directory'),
                $fileName
            );


            $sketch->setPath($fileName);
            

            $db = $this->getDoctrine()->getManager();
			$db->persist($sketch);
			$db->flush();

            return $this->redirectToRoute('homepage');
        }

        return $this->render('home/upload.html.twig', array(
            'form' => $form->createView(),
        ));

    }
}
