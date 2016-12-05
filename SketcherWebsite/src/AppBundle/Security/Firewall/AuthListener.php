<?php

namespace AppBundle\Security\Firewall;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\Security\Core\Authentication\AuthenticationManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Firewall\ListenerInterface;
use AppBundle\Security\Authentication\Token\UsernamePasswordToken;

/**
 *
 * @author zanymonk
 */
class AuthListener implements ListenerInterface
{
	protected $tokenStorage;
	protected $authenticationManager;
	
	public function __construct(TokenStorageInterface $tokenStorage, AuthenticationManagerInterface $authenticationManager) {
		$this->tokenStorage = $tokenStorage;
		$this->authenticationManager = $authenticationManager;
	}
	
	public function handle(GetResponseEvent $event) {
		$request = $event->getRequest();
		
		$token = new UsernamePasswordToken(
			$request->request->get('username'),
			$request->request->get('password'),
			$this->providerKey
		);
		
		try {
			$authToken = $this->authenticationManager->authenticate($token);
			$this->tokenStorage->setToken($authToken);
			
			return;
		} catch (AuthenticationException $failed) {
			$token = $this->tokenStorage->getToken();
			
			if($token instanceof UsernamePasswordToken && $this->providerKey === $token->getProviderKey()) {
				$this->tokenStorage->setToken(null);
			}
			
			return;
		}
		
		$response = new Response();
		$response.setStatusCode(Response::HTTP_FORBIDDEN);
		$event->setResponse($response);
	}

}
