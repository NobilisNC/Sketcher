<?php
namespace AppBundle\EventListener;

use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

/**
 * Updates user's status
 */
class UserListener
{
    /**
     * @var Session
     */
	private $db;
	private $tokenStorage;
	private $session;

    public function __construct(EntityManager $db, TokenStorage $tokenStorage,  Session $session)
    {
        $this->db = $db;
		$this->tokenStorage = $tokenStorage;
        $this->session = $session;
    }

	private function getUser()
    {
		$token = $this->tokenStorage->getToken();
        return $token === null ? null : $token->getUser();
    }

    /**
     * @param controllerActivated $event
     */
    public function controllerActivated(FilterControllerEvent $event)
    {
		$user = $this->getUser();
		if($user !== null && $user !== 'anon.') {
			$user->setLastLogin(new \DateTime('now'));
			$this->db->flush();
		}
    }

    /**
     * @param InteractiveLoginEvent $event
     */
    public function onInteractiveLogin(InteractiveLoginEvent $event)
    {
        $user = $event->getAuthenticationToken()->getUser();

		$user->setLastLogin(new \DateTime('now'));
		$this->db->flush();

        if (null !== $user->getLocale()) {
            $this->session->set('_locale', $user->getLocale());
        }
    }
}
