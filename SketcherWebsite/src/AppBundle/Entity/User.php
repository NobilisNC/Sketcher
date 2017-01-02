<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 * @UniqueEntity(fields="email", message="Email {{ value }} already in use")
 * @UniqueEntity(fields="username", message="Username {{ value }} is already taken")
 */
class User implements UserInterface, \Serializable
{
	private $salt;

	/**
	 * @ORM\Column(type="integer")
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 */
	private $id;

	/**
	 * @ORM\Column(type="string", length=25, unique=true)
	 * @Assert\NotBlank()
	 */
	private $username;

	/**
		* @Assert\NotBlank()
		* @Assert\Length(max=4096)
		*/
	private $plainPassword;

	/**
	 * @ORM\Column(type="string", length=64)
	 */
	private $password;

	/**
	 * @ORM\Column(type="string", length=60, unique=true)
	 * @Assert\NotBlank()
     * @Assert\Email()
	 */
	private $email;

	/**
	 * @ORM\Column(type="string", length=5)
	 * @Assert\NotBlank()
     * @Assert\Locale()
	 */
	private $locale;

	/**
	 * @ORM\Column(name="is_active", type="boolean")
	 */
	private $isActive;

	/**
	 * @ORM\Column(name="is_admin", type="boolean", options={"default": false})
	 */
	private $isAdmin;

	public function __construct() {
		$this->isActive = true;
		$this->isAdmin = false;
		$this->username = "";
		$this->salt = md5(uniqid(null, true));
	}

	public function eraseCredentials() {

	}

	public function getPassword(): string {
		return $this->password;
	}

	public function getRoles() {
		return array('ROLE_USER');
	}

	public function getSalt() {
		return $this->salt;
	}

	public function getUsername(): string {
		return $this->username;
	}

	public function serialize(): string {
		return serialize(array(
			$this->id,
			$this->username,
			$this->password,
			$this->salt
		));
	}

	public function unserialize($serialized) {
		return list(
			$this->id,
			$this->username,
			$this->password,
			$this->salt
		) = unserialize($serialized);
	}


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return User
     */
    public function setUsername($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Set password
     *
     * @param string $password
     *
     * @return User
     */
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Set email
     *
     * @param string $email
     *
     * @return User
     */
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get email
     *
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set isActive
     *
     * @param boolean $isActive
     *
     * @return User
     */
    public function setIsActive($isActive)
    {
        $this->isActive = $isActive;

        return $this;
    }

    /**
     * Get isActive
     *
     * @return boolean
     */
    public function getIsActive()
    {
        return $this->isActive;
    }

    /**
     * Set isAdmin
     *
     * @param boolean $isAdmin
     *
     * @return User
     */
    public function setIsAdmin($isAdmin)
    {
        $this->isAdmin = $isAdmin;

        return $this;
    }

    /**
     * Get isAdmin
     *
     * @return boolean
     */
    public function getIsAdmin()
    {
        return $this->isAdmin;
    }

	public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    public function setPlainPassword($password)
    {
        $this->plainPassword = $password;
    }

    /**
     * Set locale
     *
     * @param string $locale
     *
     * @return User
     */
    public function setLocale($locale)
    {
        $this->locale = $locale;

        return $this;
    }

    /**
     * Get locale
     *
     * @return string
     */
    public function getLocale()
    {
        return $this->locale;
    }
}
