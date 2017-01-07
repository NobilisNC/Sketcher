<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;

/**
* @Route("/api", name="api")
*/
class RESTController extends Controller
{
    /**
     * @Route(
	 *   "/{token}",
	 *   requirements={"token" = "[a-f\d]{32}"},
	 *   name="apiCheckToken"
	 *	)
	 * @Method({"GET"})
     */
    public function checkTokenAction(Request $request, $token)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$db = $this->getDoctrine()->getManager();
		$user = $db->getRepository('AppBundle:User')->findOneByEditToken($token);

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "Invalid token."}');

		return $res->setContent('{"status": "success"}');
	}

    /**
     * @Route(
	 *   "/{token}/refresh",
	 *   requirements={"token" = "[a-f\d]{32}"},
	 *   name="apiRefresh"
	 *	)
	 * @Method({"GET"})
     */
    public function refreshAction(Request $request, $token)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$db = $this->getDoctrine()->getManager();
		$user = $db->getRepository('AppBundle:User')->findOneByEditToken($token);

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "Invalid token."}');

		$sketch = $user->getEditedSketch();

		if(!$sketch)
			return $res->setStatusCode(404)->setContent('{"status": "error", "msg": "Sketch not found."}');

		return $res->setContent($sketch->getData());
	}

    /**
     * @Route(
	 *   "/{token}",
	 *   requirements={"sketchId" = "[a-f\d]{32}"},
	 *   name="apiUpdate"
	 * )
	 * @Method({"POST"})
     */
    public function updateAction(Request $request, $token)
    {
		$res = new Response();
		$res->headers->set('Content-Type', 'application/json');

		$db = $this->getDoctrine()->getManager();
		$user = $db->getRepository('AppBundle:User')->findOneByEditToken($token);

		if(!$user)
			return $res->setStatusCode(403)->setContent('{"status": "error", "msg": "Invalid token."}');

		$sketch = $user->getEditedSketch();

		if(!$sketch)
			return $res->setStatusCode(404)->setContent('{"status": "error", "msg": "Sketch not found."}');

		$layer = $request->request->all()['layers'];
		if($layer)
			$sketch->setData($layer);
			
		$db->persist($sketch);
		$db->flush();

		return $res->setContent('{"status": "success"}');
	}

    /**
     * @Route(
	 *   "/{token}",
	 *   requirements={"token" = "[a-f\d]{32}"},
	 *   name="apiListCollaborators"
	 * )
	 * @Method({"OPTIONS"})
     */
    public function listCollaboratorsAction(Request $request, int $token)
    {
		return new Response("list collaborators");
	}
}
