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
	 *   "/{sketchId}",
	 *   requirements={"sketchId" = "[a-f\d]{32}"},
	 *   name="apiRefresh"
	 *	)
	 * @Method({"GET"})
     */
    public function refreshAction(Request $request, $sketchId)
    {
		if(!$this->getUser())
			return new Response('403 - Unauthorized', 403);

		return new Response("refresh ".$sketchId);
	}

    /**
     * @Route(
	 *   "/{sketchId}",
	 *   requirements={"sketchId" = "[a-f\d]{32}"},
	 *   name="apiUpdate"
	 * )
	 * @Method({"POST"})
     */
    public function updateAction(Request $request, $sketchId)
    {
		return new Response("update");
	}

    /**
     * @Route(
	 *   "/{sketchId}",
	 *   requirements={"sketchId" = "[a-f\d]{32}"},
	 *   name="apiListCollaborators"
	 * )
	 * @Method({"OPTIONS"})
     */
    public function listCollaboratorsAction(Request $request, int $sketchId)
    {
		return new Response("list collaborators");
	}
}
